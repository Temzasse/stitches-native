import { PartialDeep } from 'type-fest';
import { PixelRatio, useWindowDimensions } from 'react-native';

import React, {
  memo,
  useContext,
  forwardRef,
  cloneElement,
  createElement,
  createContext
} from 'react';

import {
  Config,
  CssFnStyles,
  StyledConfig,
  ComponentProps,
  ThemeDefinition
} from './types/index';

import {
  createStyleSheets,
  getCompoundKey,
  processStyles,
  resolveMediaRangeQuery
} from './utils';

import { StyledPrimitive } from './types/react-native';

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

  function styled<
    T extends Function, // TODO: what is the type of styled component?
    S extends StyledConfig<StyledPrimitive, C>
  >(component: T, styledConfig: S): any;
  function styled<T extends StyledPrimitive, S extends StyledConfig<T, C>>(
    component: T,
    styledConfig: S
  ): any;
  function styled<T extends StyledPrimitive, S extends StyledConfig<T, C>>(
    component: any,
    styledConfig: any
  ) {
    const {
      variants = {},
      compoundVariants = [],
      defaultVariants = {},
      ..._styles
    } = styledConfig;

    let styles = {};

    // Handle responsive base styles
    if (typeof config.media === 'object') {
      Object.entries(_styles).forEach(([key, val]) => {
        if (key in config.media) {
          // TODO: do we want to handle media range queries in the styled definition?
          if (config.media[key] === true && typeof val === 'object') {
            styles = { ...styles, ...val };
          } else {
            // Make sure other media styles are removed so they won't be passed on to StyleSheet
            delete _styles[key];
          }
        } else {
          styles[key] = val;
        }
      });
    } else {
      styles = _styles;
    }

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
      const { width: windowWidth } = useWindowDimensions();

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
                const breakpoint = `@${key}`;

                if (propValue[breakpoint] === undefined) return;

                if (val === true) {
                  styleSheetKey = `${prop}_${propValue[breakpoint]}`;
                } else if (typeof val === 'string') {
                  const correctedWindowWidth = PixelRatio.getPixelSizeForLayoutSize(
                    windowWidth
                  );

                  // TODO: how do we quarantee the order of breakpoint matches?
                  // The order of the media key value pairs should be constant
                  // but is that guaranteed? So if the keys are ordered from
                  // smallest screen size to largest everything should work ok...
                  const match = resolveMediaRangeQuery(
                    val,
                    correctedWindowWidth
                  );

                  if (match) {
                    styleSheetKey = `${prop}_${propValue[breakpoint]}`;
                  }
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

      const componentProps = {
        ...props,
        style: [
          styleSheet.base,
          ...variantStyles,
          ...compoundVariantStyles,
          cssStyles,
          props.style
        ],
        ref
      };

      if (typeof component === 'string') {
        return createElement(ReactNative[component], componentProps);
      } else if (typeof component === 'object') {
        return cloneElement(component, componentProps);
      }

      return null;
    });

    return memo(Comp);
  }

  function css<T extends StyledPrimitive = 'View'>(
    cssStyles: CssFnStyles<T, C>
  ) {
    return cssStyles;
  }

  return { styled, css, theme, ThemeProvider };
}
