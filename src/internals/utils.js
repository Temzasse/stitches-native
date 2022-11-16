import { StyleSheet } from 'react-native';
import merge from 'lodash.merge';
import { DEFAULT_THEME_MAP, THEME_VALUES } from './constants';

export function getCompoundKey(compoundEntries) {
  // Eg. `color_primary+size_small`
  return (
    compoundEntries
      // Sort compound entries alphabetically
      .sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
      })
      .reduce((keyAcc, [prop, value]) => {
        return keyAcc + `${prop}_${value}+`;
      }, '')
      .slice(0, -1)
  ); // Remove last `+` character
}

const validSigns = ['<=', '<', '>=', '>'];

function matchMediaRangeQuery(query, windowWidth) {
  const singleRangeRegex = /^\(width\s+([><=]+)\s+([0-9]+)px\)$/;
  const multiRangeRegex = /^\(([0-9]+)px\s([><=]+)\swidth\s+([><=]+)\s+([0-9]+)px\)$/; // prettier-ignore
  const singleRangeMatches = query.match(singleRangeRegex);
  const multiRangeMatches = query.match(multiRangeRegex);

  let result;

  if (multiRangeMatches && multiRangeMatches.length === 5) {
    const [, _width1, sign1, sign2, _width2] = multiRangeMatches;
    const width1 = parseInt(_width1, 10);
    const width2 = parseInt(_width2, 10);

    if (validSigns.includes(sign1) && validSigns.includes(sign2)) {
      result = eval(
        `${width1} ${sign1} ${windowWidth} && ${windowWidth} ${sign2} ${width2}`
      );
    }
  } else if (singleRangeMatches && singleRangeMatches.length === 3) {
    const [, sign, _width] = singleRangeMatches;
    const width = parseInt(_width, 10);

    if (validSigns.includes(sign)) {
      result = eval(`${windowWidth} ${sign} ${width}`);
    }
  }

  if (result === undefined) return false;

  if (typeof result !== 'boolean') {
    console.warn(
      `Unexpected media query result. Expected a boolean but got ${result}. Please make sure your media query syntax is correct.`
    );
  }

  return result;
}

function createMatchedMedia(mediaKey) {
  return {
    mediaKey: mediaKey,
    breakpoint: mediaKey && `@${mediaKey}`,
  };
}

export function resolveMediaRangeQuery(queryObjects, windowWidth) {
  const iterator = Object.entries(queryObjects);
  const mediaAppliedKeys = [];
  for (let i = 0; i < iterator.length; i++) {
    const [key, query] = iterator[i];
    if (query === true) {
      mediaAppliedKeys.push(createMatchedMedia(key));
    }
    if (typeof query !== 'string') continue;
    const match = matchMediaRangeQuery(query, windowWidth);
    if (match) {
      mediaAppliedKeys.push(createMatchedMedia(key));
    }
  }
  return mediaAppliedKeys;
}

export function applyMediaStyles(originalStyle, matchedMedias) {
  return matchedMedias.reduce(
    (currentStyle, matcheMedia) => {
      const breakpoint = matcheMedia.breakpoint;
      if (breakpoint && breakpoint in originalStyle) {
        return merge(currentStyle, originalStyle[breakpoint]);
      }
      return currentStyle;
    },
    { ...originalStyle }
  );
}

export function processThemeMap(themeMap) {
  const definition = {};

  Object.keys(themeMap).forEach((token) => {
    const scale = themeMap[token];

    if (!definition[scale]) {
      definition[scale] = {};
    }

    definition[scale][token] = scale;
  });

  return definition;
}

export function processTheme(theme) {
  const definition = {};
  const values = {};

  Object.keys(theme).forEach((scale) => {
    if (!definition[scale]) definition[scale] = {};
    if (!values[scale]) values[scale] = {};

    Object.keys(theme[scale]).forEach((token) => {
      let value = theme[scale][token];

      if (typeof value === 'string' && value.length > 1 && value[0] === '$') {
        value = theme[scale][value.replace('$', '')];
      }

      values[scale][token] = value;

      definition[scale][token] = {
        token,
        scale,
        value,
        toString: () => `$${token}`,
      };
    });
  });

  return { definition, values };
}

function getThemeKey(theme, themeMap, key) {
  return Object.keys(THEME_VALUES).find((themeKey) => {
    return key in (themeMap[themeKey] || {}) && theme?.[themeKey];
  });
}

export function processStyles({ styles, theme, config }) {
  const { utils, themeMap: customThemeMap } = config;
  const themeMap = processThemeMap(customThemeMap || DEFAULT_THEME_MAP);

  return Object.entries(styles).reduce((acc, [key, val]) => {
    if (utils && key in utils) {
      // NOTE: Deep merge for media properties.
      acc = merge(
        acc,
        processStyles({ styles: utils[key](val), theme, config })
      );
    } else if (typeof val === 'string' && val.indexOf('$') !== -1) {
      // Handle theme tokens, eg. `color: "$primary"` or `color: "$colors$primary"`
      const arr = val.split('$');
      const token = arr.pop();
      const scaleOrSign = arr.pop();
      const maybeSign = arr.pop(); // handle negative values
      const scale = scaleOrSign !== '-' ? scaleOrSign : undefined;
      const sign = scaleOrSign === '-' || maybeSign === '-' ? -1 : undefined;

      if (scale && theme[scale]) {
        acc[key] = theme[scale][token];
      } else {
        const themeKey = getThemeKey(theme, themeMap, key);
        if (themeKey) {
          acc[key] = theme[themeKey][token];
        }
      }
      if (typeof acc[key] === 'number' && sign) {
        acc[key] *= sign;
      }
    } else if (typeof val === 'object' && val.value !== undefined) {
      // Handle cases where the value comes from the `theme` returned by `createStitches`
      acc[key] = val.value;
    } else if (typeof acc[key] === 'object' && typeof val === 'object') {
      // Handle cases where media object value comes from top of a style prop and variants' ones
      acc[key] = merge(acc[key], val);
    } else {
      acc[key] = val;
    }

    return acc;
  }, {});
}

export function createStyleSheets({
  themes,
  styles,
  config,
  variants,
  compoundVariants,
}) {
  const styleSheets = themes.reduce((styleSheetAcc, theme) => {
    styleSheetAcc[theme.definition.__ID__] = StyleSheet.create({
      base: styles
        ? processStyles({ styles, config, theme: theme.values })
        : {},
      // Variant styles
      ...Object.entries(variants).reduce(
        (variantsAcc, [vartiantProp, variantValues]) => {
          Object.entries(variantValues).forEach(
            ([variantName, variantStyles]) => {
              // Eg. `color_primary` or `size_small`
              const key = `${vartiantProp}_${variantName}`;

              variantsAcc[key] = processStyles({
                styles: variantStyles,
                config,
                theme: theme.values,
              });
            }
          );
          return variantsAcc;
        },
        {}
      ),
      // Compound variant styles
      ...compoundVariants.reduce((compoundAcc, compoundVariant) => {
        const { css, ...compounds } = compoundVariant;
        const compoundEntries = Object.entries(compounds);

        if (compoundEntries.length > 1) {
          const key = getCompoundKey(compoundEntries);

          compoundAcc[key] = processStyles({
            styles: css || {},
            config,
            theme: theme.values,
          });
        }

        return compoundAcc;
      }, {}),
    });

    return styleSheetAcc;
  }, {});

  return styleSheets;
}
