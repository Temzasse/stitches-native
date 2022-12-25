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

export function resolveMediaRangeQuery(media, windowWidth) {
  const entries = Object.entries(media);
  let result;

  for (let i = 0; i < entries.length; i++) {
    const [breakpoint, queryOrFlag] = entries[i];

    // TODO: handle boolean flag
    if (typeof queryOrFlag !== 'string') continue;

    const match = matchMediaRangeQuery(queryOrFlag, windowWidth);

    if (match) {
      result = breakpoint;
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

export function createStyleSheet({
  theme,
  styles,
  config,
  variants,
  compoundVariants,
}) {
  return StyleSheet.create({
    base: styles ? processStyles({ styles, config, theme: theme.values }) : {},
    // Variant styles
    ...Object.entries(variants).reduce(
      (variantsAcc, [variantProp, variantValues]) => {
        Object.entries(variantValues).forEach(
          ([variantName, variantStyles]) => {
            // Eg. `color_primary` or `size_small`
            const key = `${variantProp}_${variantName}`;

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
}

/**
 * Flatten styles so that styles from utils and media queries are recursively merged.
 *
 * For example:
 *
 * createStitches({
 *   media: {
 *     bp1: '(min-width: 640px)',
 *     bp2: '(min-width: 1024px)',
 *   },
 *   utils: {
 *     util1: (value) => ({
 *       fontSize: value,
 *       '@bp1': {
 *          fontSize: value / 2,
 *       },
 *       '@bp2': {
 *          fontSize: value * 2,
 *       }
 *     }),
 *     util2: (value) => ({
 *       util1: 20, // <---- utils can use other utils!
 *       width: value,
 *       height: value,
 *       '@bp2': {
 *          width: value * 3,
 *          height: value * 3,
 *       }
 *     }),
 *   }
 * });
 *
 * const Example = styled('div', {
 *   color: 'red',
 *   util2: 100,
 *  '@bp1': {
 *     color: 'blue',
 *   }
 * }
 *
 * Result:
 * {
 *   color: 'red',
 *   fontSize: 20,
 *   width: 100,
 *   height: 100,
 *   '@bp1': {
 *     color: 'blue',
 *     fontSize: 10,
 *   },
 *   '@bp2': {
 *     fontSize: 40,
 *     width: 300,
 *     height: 300,
 *   }
 * }
 */
export function flattenStyles(styles, utils) {
  let flatStyles = {};

  Object.entries(styles).forEach(([key, val]) => {
    if (key.startsWith('@')) {
      const k = key.replace('@', '');
      // Media queries
      if (!flatStyles[k]) {
        flatStyles[k] = {};
      }
      flatStyles[k] = merge(flatStyles[k], flattenStyles(val, utils));
    } else if (utils && key in utils) {
      // Utils
      const util = utils[key];
      flatStyles = merge(flatStyles, flattenStyles(util(val), utils));
    } else {
      // Base styles
      flatStyles[key] = val;
    }
  });

  return flatStyles;
}

/**
 * Flatten the styles inside variant definitions so that utils and media styles are recusively merged.
 *
 * For example:
 *
 * createStitches({
 *   media: {
 *     bp1: '(min-width: 640px)',
 *     bp2: '(min-width: 1024px)',
 *   },
 *   utils: {
 *     util1: (value) => ({
 *       fontSize: value,
 *       '@bp1': {
 *          fontSize: value / 2,
 *       },
 *       '@bp2': {
 *          fontSize: value * 2,
 *       }
 *     }),
 *     util2: (value) => ({
 *       util1: 20,
 *       width: value,
 *       height: value,
 *       '@bp2': {
 *          width: value * 3,
 *          height: value * 3,
 *       }
 *     }),
 *   }
 * });
 *
 * const Example = styled('div', {
 *   variants: {
 *     v1: {
 *       x: {
 *         util1: 20,
 *       },
 *       y: {
 *         util2: 200,
 *       },
 *     }
 *   }
 * }
 *
 * Result:
 * variants: {
 *   v1: {
 *     x: {
 *       fontSize: 20,
 *       bp1: {
 *         fontSize: 10,
 *       },
 *       bp2: {
 *         fontSize: 40,
 *       }
 *     },
 *     y: {
 *       width: 100,
 *       height: 100,
 *       fontSize: 20,
 *       bp1: {
 *         fontSize: 10,
 *       },
 *       bp2: {
 *         fontSize: 40,
 *         width: 300,
 *         height: 300,
 *       },
 *     },
 *   },
 * }
 */
export function flattenVariantStyles(variants, utils) {
  const flatVariants = {};

  Object.entries(variants).forEach(([variantProp, variantObj]) => {
    flatVariants[variantProp] = {};
    Object.entries(variantObj).forEach(([variantName, variantStyles]) => {
      flatVariants[variantProp][variantName] = flattenStyles(
        variantStyles,
        utils
      );
    });
  });

  return flatVariants;
}

/**
 * Flatten the styles inside compound variant definitions so that utils and media styles are recusively merged.
 *
 * For example:
 *
 * createStitches({
 *   media: {
 *     bp1: '(min-width: 640px)',
 *     bp2: '(min-width: 1024px)',
 *   },
 *   utils: {
 *     util1: (value) => ({
 *       fontSize: value,
 *       '@bp1': {
 *          fontSize: value / 2,
 *       },
 *       '@bp2': {
 *          fontSize: value * 2,
 *       }
 *     }),
 *     util2: (value) => ({
 *       util1: 20,
 *       width: value,
 *       height: value,
 *       '@bp2': {
 *          width: value * 3,
 *          height: value * 3,
 *       },
 *     }),
 *   },
 * });
 *
 * compoundVariants: [{
 *   v1: 'x',
 *   v2: 'y',
 *   css: {
 *     util2: 100,
 *     '@bp1': {
 *       color: 'blue',
 *     }
 *   }
 * }]
 *
 * Result:
 * compoundVariants: [{
 *   v1: 'x',
 *   v2: 'y',
 *   css: {
 *     width: 100,
 *     height: 100,
 *     fontSize: 20,
 *     bp1: {
 *       color: 'blue',
 *       fontSize: 10,
 *     },
 *     bp2: {
 *       fontSize: 40,
 *       width: 300,
 *       height: 300,
 *     },
 *   },
 * }]
 */
export function flattenCompoundVariantStyles(compoundVariants, utils) {
  return compoundVariants.map((compoundVariant) => {
    return {
      ...compoundVariant,
      css: flattenStyles(compoundVariant.css, utils),
    };
  });
}
