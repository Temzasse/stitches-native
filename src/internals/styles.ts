// @ts-nocheck
import { StyleSheet } from 'react-native';
import { DEFAULT_THEME_MAP } from './constants';
import { getThemeKey, processThemeMap } from './theme';
import { getCompoundKey } from './utils';

/**
 * Process styles by replacing all theme tokens with their actual value.
 * NOTE: passed styles need to be flattened before calling this!
 */
export function processStyles({ styles, theme, themeMap: customThemeMap }) {
  const themeMap = processThemeMap(customThemeMap || DEFAULT_THEME_MAP);

  return Object.entries(styles).reduce((acc, [key, val]) => {
    if (typeof val === 'string' && val.indexOf('$') !== -1) {
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
    } else {
      // Value is a regular style value
      acc[key] = val;
    }

    return acc;
  }, {});
}

export function createStyleSheet({
  theme,
  themeMap,
  styles,
  variants,
  compoundVariants,
}) {
  return StyleSheet.create({
    base: styles
      ? processStyles({
          styles,
          theme,
          themeMap,
        })
      : {},
    // Variant styles
    ...Object.entries(variants).reduce(
      (variantsAcc, [variantProp, variantValues]) => {
        Object.entries(variantValues).forEach(
          ([variantName, variantStyles]) => {
            // Eg. `color_primary` or `size_small`
            const key = `${variantProp}_${variantName}`;

            variantsAcc[key] = processStyles({
              styles: variantStyles,
              theme,
              themeMap,
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
          theme,
          themeMap,
        });
      }

      return compoundAcc;
    }, {}),
  });
}

/**
 * Process the style sheet by inlining media styles.
 *
 * For example:
 *
 * prop_value: {
 *   color: 'red',
 *   md: { color: 'blue' }
 * }
 *
 * with `md` media query being active becomes:
 *
 * prop_value: {
 *   color: 'blue'
 * }
 *
 * @param {Record<string, object>} styleSheet
 * @param {string[]} activeMediaQueries
 * @returns {Record<string, object>}
 */
export function processStyleSheet(styleSheet, media, activeMediaQueries) {
  const prosessedStyleSheet = {};

  Object.entries(styleSheet).forEach(([sKey, sVal]) => {
    prosessedStyleSheet[sKey] = {};

    const mediaStyles = {};

    Object.entries(sVal).forEach(([vKey, vValue]) => {
      if (vKey in media) {
        // Only apply media styles that are "active"
        if (activeMediaQueries.includes(vKey)) {
          mediaStyles[vKey] = vValue;
        }
      } else {
        prosessedStyleSheet[sKey][vKey] = vValue;
      }
    });

    // Apply media styles in right order so that "specificity" is maintained
    activeMediaQueries.forEach((mediaKey) => {
      const style = mediaStyles[mediaKey];

      if (style) {
        prosessedStyleSheet[sKey] = {
          ...prosessedStyleSheet[sKey],
          ...style,
        };
      }
    });
  });

  return prosessedStyleSheet;
}
