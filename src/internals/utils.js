import { StyleSheet } from 'react-native';
import merge from 'lodash.merge';
import { DEFAULT_THEME_MAP } from './constants';

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

export function resolveMediaRangeQuery(queryObjects, windowWidth) {
  const iterator = Object.entries(queryObjects);
  let result;
  for (let i = 0; i < iterator.length; i++) {
    const [key, query] = iterator[i];
    if (typeof query !== 'string') continue;
    const match = matchMediaRangeQuery(query, windowWidth);
    if (match) {
      result = key;
    }
  }
  return result;
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

const THEME_PRIORITIZED_KEYS = [
  'colors',
  'radii',
  'sizes',
  'space',
  'borderStyles',
  'borderWidths',
  'fonts',
  'fontSizes',
  'fontWeights',
  'lineHeights',
  'zIndices',
  'letterSpacings',
];

function searchHaveTokenConfigKey(theme, themeMap, key) {
  for (let i = 0, len = THEME_PRIORITIZED_KEYS.length; i < len; i++) {
    const configKey = THEME_PRIORITIZED_KEYS[i];
    if (key in (themeMap[configKey] || {}) && theme?.[configKey]) {
      return configKey;
    }
  }
}

export function processStyles({ styles, theme, config }) {
  const { utils, themeMap: customThemeMap } = config;
  const themeMap = processThemeMap(customThemeMap || DEFAULT_THEME_MAP);

  return Object.entries(styles).reduce((acc, [key, val]) => {
    if (utils && key in utils) {
      // NOTE: Deepmerge for media properties.
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
        const configKey = searchHaveTokenConfigKey(theme, themeMap, key);
        if (configKey) {
          acc[key] = theme[configKey][token];
        }
      }

      if (typeof acc[key] === 'number' && sign) {
        acc[key] *= sign;
      }
    } else if (typeof val === 'object' && val.value !== undefined) {
      // Handle cases where the value comes from the `theme` returned by `createStitches`
      acc[key] = val.value;
    } else if (typeof acc[key] === 'object' && typeof val === 'object') {
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
