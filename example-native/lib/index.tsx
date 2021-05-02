import { createElement, forwardRef, memo } from 'react';

import {
  Config,
  StyledConfig,
  StyledComponent,
  ComponentProps,
  AllStyleProperties,
  AnyStyleProperties
} from './types';

import { getCompoundKey, processStyles } from './utils';

const ReactNative = require('react-native');

/**
 * API: https://stitches.dev/docs/api
 * - Local scoped tokens ($$shadowColor: 'red')
 * - Scale-prefixed tokens (marginTop: '$sizes$1')
 */

export function createCss<C extends Config>(config: C) {
  function styled<T extends StyledComponent, S extends StyledConfig<T>>(
    component: T,
    styledConfig: S
  ) {
    const {
      variants = {},
      compoundVariants = [],
      defaultVariants = {},
      ...styles
    } = styledConfig;

    const styleSheet = ReactNative.StyleSheet.create({
      base: processStyles(styles, config),
      // Variant styles
      ...Object.entries(variants).reduce(
        (acc, [vartiantProp, variantValues]) => {
          Object.entries(variantValues).forEach(
            ([variantName, variantValue]) => {
              // Eg. `color_primary` or `size_small`
              const key = `${vartiantProp}_${variantName}`;
              acc[key] = processStyles(variantValue, config);
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
          acc[key] = processStyles(css, config);
        }

        return acc;
      }, {} as { [key: string]: AnyStyleProperties })
    });

    const Comp = forwardRef<any, ComponentProps<T>>((props, ref) => {
      let variantStyles = [];
      let compoundVariantStyles = [];
      const p = props as any; // TODO: fix type

      if (variants) {
        variantStyles = Object.keys(variants)
          .map(prop => {
            const key = `${prop}_${p[prop] || defaultVariants[prop]}`;
            return styleSheet[key];
          })
          .filter(Boolean);
      }

      if (compoundVariants) {
        compoundVariantStyles = compoundVariants
          .map(compoundVariant => {
            const { css, ...compounds } = compoundVariant;
            const compoundEntries = Object.entries(compounds);

            if (compoundEntries.every(([prop, value]) => p[prop] === value)) {
              const key = getCompoundKey(compoundEntries);
              return styleSheet[key];
            }
          })
          .filter(Boolean);
      }

      return createElement(ReactNative[component], {
        ...p,
        style: [
          styleSheet.base,
          ...variantStyles.concat(compoundVariantStyles),
          processStyles(props.css, config),
          p.style
        ],
        ref
      });
    });

    return memo(Comp);
  }

  const css = (cssStyles: AllStyleProperties) => ({});

  return { styled, css };
}
