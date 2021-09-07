import { StyleSheet } from 'react-native';
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

export function resolveMediaRangeQuery(query, windowWidth) {
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

export function processTheme(theme) {
  const processed = {};

  Object.keys(theme).forEach((scale) => {
    if (!processed[scale]) processed[scale] = {};

    Object.keys(theme[scale]).forEach((token) => {
      let value = theme[scale][token];

      if (typeof value === 'string' && value.length > 1 && value[0] === '$') {
        value = theme[scale][value.replace('$', '')];
      }

      processed[scale][token] = {
        token,
        scale,
        value,
        toString: () => `$${token}`,
      };
    });
  });

  return processed;
}

export function processStyles({ styles, theme, config }) {
  const { utils, themeMap = DEFAULT_THEME_MAP } = config;

  return Object.entries(styles).reduce((acc, [key, val]) => {
    if (utils && key in utils) {
      acc = {
        ...acc,
        ...processStyles({ styles: utils[key](val), theme, config }),
      };
    } else if (typeof val === 'string' && val.indexOf('$') !== -1) {
      // Handle theme tokens, eg. `color: "$primary"` or `color: "$colors$primary"`
      const arr = val.split('$');
      const token = arr.pop();
      const scale = arr.pop();

      if (scale && theme[scale]) {
        acc[key] = theme[scale][token].value;
      } else if (key in (themeMap.colors || {}) && theme?.colors) {
        acc[key] = theme.colors[token].value;
      } else if (key in (themeMap.radii || {}) && theme?.radii) {
        acc[key] = theme.radii[token].value;
      } else if (key in (themeMap.sizes || {}) && theme?.sizes) {
        acc[key] = theme.sizes[token].value;
      } else if (key in (themeMap.space || {}) && theme?.space) {
        acc[key] = theme.space[token].value;
      } else if (key in (themeMap.borderStyles || {}) && theme?.borderStyles) {
        acc[key] = theme.borderStyles[token].value;
      } else if (key in (themeMap.borderWidths || {}) && theme?.borderWidths) {
        acc[key] = theme.borderWidths[token].value;
      } else if (key in (themeMap.fonts || {}) && theme?.fonts) {
        acc[key] = theme.fonts[token].value;
      } else if (key in (themeMap.fontSizes || {}) && theme?.fontSizes) {
        acc[key] = theme.fontSizes[token].value;
      } else if (key in (themeMap.fontWeights || {}) && theme?.fontWeights) {
        acc[key] = theme.fontWeights[token].value;
      } else if (key in (themeMap.lineHeights || {}) && theme?.lineHeights) {
        acc[key] = theme.lineHeights[token].value;
      } else if (key in (themeMap.zIndices || {}) && theme?.zIndices) {
        acc[key] = theme.zIndices[token].value;
      } else if (
        key in (themeMap.letterSpacings || {}) &&
        theme?.letterSpacings
      ) {
        acc[key] = theme.letterSpacings[token].value;
      }
    } else if (typeof val === 'object' && val.value !== undefined) {
      // Handle cases where the value comes from the `theme` returned by `createStitches`
      acc[key] = val.value;
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
  const styleSheets = themes.reduce((styleSheetAcc, { id, values: theme }) => {
    styleSheetAcc[id] = StyleSheet.create({
      base: styles ? processStyles({ styles, config, theme }) : {},
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
                theme,
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
            theme,
          });
        }

        return compoundAcc;
      }, {}),
    });

    return styleSheetAcc;
  }, {});

  return styleSheets;
}
