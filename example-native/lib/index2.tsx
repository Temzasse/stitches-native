import { createElement, forwardRef, memo } from 'react';

import { getCompoundKey, processStyles } from './utils';

const ReactNative = require('react-native');

export { DEFAULT_THEME_MAP as defaultThemeMap } from './constants';

function _createCss(config: any) {
  function _styled(component: string, styledConfig: any) {
    const {
      variants = {},
      compoundVariants = [],
      defaultVariants = {},
      ...styles
    } = styledConfig;

    const styleSheet = ReactNative.StyleSheet.create({
      base: styles ? processStyles(styles as any, config) : {},
      // Variant styles
      ...Object.entries(variants).reduce(
        (acc, [vartiantProp, variantValues]) => {
          Object.entries(variantValues as any).forEach(
            ([variantName, variantValue]) => {
              // Eg. `color_primary` or `size_small`
              const key = `${vartiantProp}_${variantName}`;
              acc[key] = processStyles((variantValue || {}) as any, config);
            }
          );
          return acc;
        },
        {} as any
      ),
      // Compound variant styles
      ...compoundVariants.reduce((acc: any, compoundVariant: any) => {
        const { css, ...compounds } = compoundVariant;
        const compoundEntries = Object.entries(compounds);

        if (compoundEntries.length > 1) {
          const key = getCompoundKey(compoundEntries);
          acc[key] = processStyles((css || {}) as any, config);
        }

        return acc;
      }, {} as any)
    });

    const Comp = forwardRef<any, any>((props: any, ref) => {
      let variantStyles = [];
      let compoundVariantStyles = [];

      if (variants) {
        variantStyles = Object.keys(variants)
          .map(prop => {
            const key = `${prop}_${props[prop] || defaultVariants[prop]}`;
            return styleSheet[key];
          })
          .filter(Boolean) as any;
      }

      if (compoundVariants) {
        compoundVariantStyles = compoundVariants
          .map(compoundVariant => {
            const { css, ...compounds } = compoundVariant;
            const compoundEntries = Object.entries(compounds);

            if (
              compoundEntries.every(([prop, value]) => props[prop] === value)
            ) {
              const key = getCompoundKey(compoundEntries);
              return styleSheet[key];
            }
          })
          .filter(Boolean);
      }

      return createElement(ReactNative[component], {
        ...props,
        style: [
          styleSheet.base,
          ...variantStyles,
          ...compoundVariantStyles,
          processStyles(props.css || {}, config),
          props.style
        ],
        ref
      });
    });

    return memo(Comp);
  }

  function _css(cssStyles: any) {
    const styleSheet = ReactNative.StyleSheet.create({
      styles: processStyles(cssStyles as any, config)
    });

    return styleSheet.styles;
  }

  function theme() {
    
  }

  // TODO: fix types
  const styled = _styled as any;
  const css = _css as any;

  return { styled, css };
}

export const createCss = _createCss as any;
