// @ts-nocheck
import { useMemo, useRef } from 'react';
import { PixelRatio, useWindowDimensions } from 'react-native';
import { resolveMediaRangeQueries } from './media';
import { processStyleSheet } from './styles';
import { getCompoundKey } from './utils';

/**
 * @param {Record<string, string | boolean>} media Media queries defined in the Stitches config.
 * {
 *   bp1: '(width <= 480px)',
 *   bp2: '(width <= 768px)',
 *   bp3: '(width <= 1024px)',
 *   phone: !DeviceInfo.isTablet(),
 *   tablet: DeviceInfo.isTablet(),
 * }
 */
export function useMediaQueries(media) {
  const { width: windowWidth } = useWindowDimensions();

  return useMemo(() => {
    const correctedWidth = PixelRatio.getPixelSizeForLayoutSize(windowWidth);
    return resolveMediaRangeQueries(media, correctedWidth);
  }, [windowWidth]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useProcessedStyleSheet({
  media,
  activeMediaQueries,
  styleSheet,
}) {
  return useMemo(() => {
    return processStyleSheet(styleSheet, media, activeMediaQueries);
  }, [styleSheet, activeMediaQueries]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useVariantStyles({
  props: _props,
  variants,
  defaultVariants,
  media,
  styleSheet,
  activeMediaQueries,
}) {
  // Only recalculate if the variant props have changed
  const props = useStableVariantProps(variants, _props);

  return useMemo(() => {
    if (!variants || Object.keys(variants).length === 0) return [];

    return Object.keys(variants)
      .map((prop) => {
        let variantStyle = {};
        let propValue = props[prop];

        if (propValue === undefined) {
          propValue = defaultVariants[prop];
        }

        // Handle responsive prop value, eg:
        // `<Text kind={{ '@initial': 'paragraph', '@lg': 'heading' }}>`
        if (typeof propValue === 'object' && typeof media === 'object') {
          const initial = propValue['@initial'];

          if (initial !== undefined && styleSheet[`${prop}_${initial}`]) {
            variantStyle = {
              ...variantStyle,
              ...styleSheet[`${prop}_${initial}`],
            };
          }

          // NOTE: there can be multiple media queries active at the same time
          // depending on how the media queries are defined!
          // Apply responsive styles in the order of active media queries
          // so that later ones overwrite earlier ones.
          if (activeMediaQueries.length > 0) {
            activeMediaQueries.forEach((mediaKey) => {
              const value = propValue[`@${mediaKey}`];

              if (value !== undefined && styleSheet[`${prop}_${value}`]) {
                variantStyle = {
                  ...variantStyle,
                  ...styleSheet[`${prop}_${value}`],
                };
              }
            });
          }
        } else {
          // Eg. `kind_heading` or `color_primary`
          variantStyle = styleSheet[`${prop}_${propValue}`];
        }

        return variantStyle;
      })
      .filter(Boolean);
  }, [props, activeMediaQueries, styleSheet]); // eslint-disable-line react-hooks/exhaustive-deps
}

export function useCompoundVariantStyles({
  props: _props,
  variants,
  defaultVariants,
  compoundVariants,
  styleSheet,
}) {
  // Only recalculate if the variant props have changed
  const props = useStableVariantProps(variants, _props);

  return useMemo(() => {
    if (!compoundVariants || compoundVariants.length === 0) return [];

    return compoundVariants
      .map(({ css: _css, ...compounds }) => {
        const compoundEntries = Object.entries(compounds);
        const compoundActive = compoundEntries.every(([prop, value]) => {
          const propValue = props[prop] ?? defaultVariants[prop];
          return propValue === value;
        });

        if (compoundActive) return styleSheet[getCompoundKey(compoundEntries)];
      })
      .filter(Boolean);
  }, [props, styleSheet]); // eslint-disable-line react-hooks/exhaustive-deps
}

// Helpers ---------------------------------------------------------------------

function variantPropsEqual(variants, props) {
  const variantKeys = Object.keys(variants);
  for (let i = 0; i < variantKeys.length; i++) {
    const key = variantKeys[i];
    if (variants[key] !== props[key]) return false;
  }
  return true;
}

function useStableVariantProps(variants, props) {
  const propsRef = useRef();

  if (!propsRef.current || !variantPropsEqual(variants, propsRef.current)) {
    propsRef.current = props;
  }

  return propsRef.current;
}
