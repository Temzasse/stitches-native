// @ts-nocheck
import merge from 'lodash.merge';

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
