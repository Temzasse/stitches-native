import { PartialDeep } from 'type-fest';

import React, {
  memo,
  useContext,
  forwardRef,
  createElement,
  createContext
} from 'react';

import {
  Config,
  StyledConfig,
  ComponentProps,
  ThemeDefinition
} from './types/index';

import { AllStyleProperty, StyledComponent } from './types/react-native';
import { createStyleSheets, getCompoundKey, processStyles } from './utils';
export { DEFAULT_THEME_MAP as defaultThemeMap } from './constants';

const ReactNative = require('react-native');

export function createCss<C extends Config>(config: C) {
  const themes: ThemeDefinition[] = [{ id: 'theme-1', values: config.theme }];

  function theme(theme: NonNullable<PartialDeep<C['theme']>>) {
    const t = {
      id: `theme-${themes.length + 1}`,
      values: Object.entries(config.theme || {}).reduce((acc, [key, val]) => {
        acc[key] = { ...val, ...theme[key] };
        return acc;
      }, {})
    };

    themes.push(t);

    return t;
  }

  const ThemeContext = createContext(themes[0]);

  function ThemeProvider({
    theme = themes[0],
    children
  }: {
    theme?: ThemeDefinition;
    children: React.ReactNode;
  }) {
    return (
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    );
  }

  function useTheme() {
    return useContext(ThemeContext);
  }

  function styled<T extends StyledComponent, S extends StyledConfig<T, C>>(
    component: T,
    styledConfig: S
  ) {
    const {
      variants = {},
      compoundVariants = [],
      defaultVariants = {},
      ...styles
    } = styledConfig;

    const styleSheets = createStyleSheets({
      styles,
      config,
      themes,
      variants,
      compoundVariants
    });

    const Comp = forwardRef<
      any,
      ComponentProps<T, C, NonNullable<S['variants']>>
    >((props: any, ref) => {
      const theme = useTheme();
      const styleSheet = styleSheets[theme.id];

      let variantStyles: any[] = [];
      let compoundVariantStyles: any[] = [];

      if (variants) {
        variantStyles = Object.keys(variants)
          .map(prop => {
            const propValue = props[prop] || defaultVariants[prop];
            let styleSheetKey = '';

            // Handle responsive prop value
            if (
              typeof propValue === 'object' &&
              typeof config.media === 'object'
            ) {
              Object.entries(config.media).forEach(([key, val]) => {
                if (val === true && propValue[key] !== undefined) {
                  styleSheetKey = `${prop}_${propValue[key]}`;
                }
              });
            } else {
              styleSheetKey = `${prop}_${propValue}`;
            }

            return styleSheetKey ? styleSheet[styleSheetKey] : undefined;
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

      const cssStyles = props.css
        ? processStyles({
            styles: props.css || {},
            theme: theme.values,
            config
          })
        : {};

      return createElement(ReactNative[component], {
        ...props,
        style: [
          styleSheet.base,
          ...variantStyles,
          ...compoundVariantStyles,
          cssStyles,
          props.style
        ],
        ref
      });
    });

    return memo(Comp);
  }

  // TODO: how can we make css aware of the current theme?
  function css(cssStyles: AllStyleProperty) {
    // const styleSheet = ReactNative.StyleSheet.create({
    //   styles: processStyles(cssStyles as any, config)
    // });

    // return styleSheet.styles;
    return {};
  }

  return { styled, css, theme, ThemeProvider };
}
