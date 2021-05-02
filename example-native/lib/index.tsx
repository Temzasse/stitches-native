import { createElement, forwardRef, memo } from 'react';

import {
  Theme,
  StyledConfig,
  StyledComponent,
  AllStyleProperties,
  AnyStyleProperties
} from './types';

import { getCompoundKey } from './utils';

const ReactNative = require('react-native');

/**
 * API: https://stitches.dev/docs/api
 * - Local scoped tokens ($$shadowColor: 'red')
 * - Scale-prefixed tokens (marginTop: '$sizes$1')
 */

type Config = {
  theme?: Theme;
  media?: any;
  utils?: any;
  themeMap?: any;
};

export const createCss = (config: Config) => {
  const { theme } = config;

  const styled = (
    component: StyledComponent,
    styledConfig: StyledConfig<StyledComponent>
  ): any => {
    const {
      variants = {},
      compoundVariants = [],
      defaultVariants = {},
      ...styles
    } = styledConfig;

    function processStyles(s: any) {
      return s; // TODO: handle theme tokens
    }

    const styleSheet = ReactNative.StyleSheet.create({
      base: processStyles(styles),
      // Variant styles
      ...Object.entries(variants).reduce(
        (acc, [vartiantProp, variantValues]) => {
          Object.entries(variantValues).forEach(
            ([variantName, variantValue]) => {
              // Eg. `color_primary` or `size_small`
              const key = `${vartiantProp}_${variantName}`;
              acc[key] = processStyles(variantValue);
            }
          );
          return acc;
        },
        {} as { [key: string]: AnyStyleProperties }
      ),
      // Compound variant styles
      ...compoundVariants.reduce((acc, compoundVariant) => {
        const { css, ...compounds } = compoundVariant;
        const compoundEntries = Object.entries(compounds);

        if (compoundEntries.length > 1) {
          const key = getCompoundKey(compoundEntries);
          acc[key] = processStyles(css);
        }

        return acc;
      }, {} as { [key: string]: AnyStyleProperties })
    });

    const Comp = forwardRef((props: any, ref: any) => {
      let variantStyles = [];
      let compoundVariantStyles = [];

      if (variants) {
        variantStyles = Object.keys(variants)
          .map(prop => {
            const key = `${prop}_${props[prop] || defaultVariants[prop]}`;
            return styleSheet[key];
          })
          .filter(Boolean);
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
          ...variantStyles.concat(compoundVariantStyles),
          processStyles(props.css),
          props.style
        ],
        ref
      });
    });

    return memo(Comp);
  };

  const css = (cssStyles: AllStyleProperties) => ({});

  return { styled, css };
};

const { styled, css } = createCss({});

export { styled, css };
