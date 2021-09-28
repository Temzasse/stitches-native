import merge from 'lodash.merge';
import { PixelRatio, useWindowDimensions } from 'react-native';

import React, {
  createContext,
  createElement,
  forwardRef,
  memo,
  useContext,
} from 'react';

import * as utils from './utils';
import * as constants from './constants';

// eslint-disable-next-line
const ReactNative = require('react-native');

export function createStitches(config = {}) {
  const themes = [];

  if (config.theme) {
    const processedTheme = utils.processTheme(config.theme);

    themes.push({ id: 'theme-1', values: processedTheme });
  } else {
    themes.push(constants.EMPTY_THEME);
  }

  function createTheme(theme) {
    const t = {
      id: `theme-${themes.length + 1}`,
      values: utils.processTheme(
        Object.entries(config.theme || {}).reduce((acc, [key, val]) => {
          acc[key] = { ...val, ...theme[key] };
          return acc;
        }, {})
      ),
    };

    themes.push(t);

    return t;
  }

  const ThemeContext = createContext(themes[0]);

  function ThemeProvider({ theme = themes[0], children }) {
    return (
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    );
  }

  function useThemeInternal() {
    const t = useContext(ThemeContext);
    if (!t) throw new Error(constants.THEME_PROVIDER_MISSING_MESSAGE);
    return t;
  }

  function useTheme() {
    const t = useContext(ThemeContext);
    if (!t) throw new Error(constants.THEME_PROVIDER_MISSING_MESSAGE);
    return t.values;
  }

  function styled(component, ...styleObjects) {
    const styleObject = styleObjects.reduce((a, v) => merge(a, v), {});

    const {
      variants = {},
      compoundVariants = [],
      defaultVariants = {},
      ..._styles
    } = styleObject;

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

    const styleSheets = utils.createStyleSheets({
      styles,
      config,
      themes,
      variants,
      compoundVariants,
    });

    const Comp = forwardRef((props, ref) => {
      const theme = useThemeInternal();
      const styleSheet = styleSheets[theme.id];
      const { width: windowWidth } = useWindowDimensions();

      let variantStyles = [];
      let compoundVariantStyles = [];

      if (variants) {
        variantStyles = Object.keys(variants)
          .map((prop) => {
            const propValue = props[prop] || defaultVariants[prop];
            let styleSheetKey = '';

            // Handle responsive prop value
            // NOTE: only one media query will be applied since the `styleSheetKey`
            // is being rewritten by the last matching media query and defaults to `@initial`
            if (
              typeof propValue === 'object' &&
              typeof config.media === 'object'
            ) {
              // `@initial` acts as the default value if none of the media query values match
              // It's basically the as setting `prop="value"`, eg. `color="primary"`
              if (typeof propValue['@initial'] === 'string') {
                styleSheetKey = `${prop}_${propValue['@initial']}`;
              }

              Object.entries(config.media).forEach(([key, val]) => {
                const breakpoint = `@${key}`;

                if (propValue[breakpoint] === undefined) return;

                if (val === true) {
                  styleSheetKey = `${prop}_${propValue[breakpoint]}`;
                } else if (typeof val === 'string') {
                  const correctedWindowWidth =
                    PixelRatio.getPixelSizeForLayoutSize(windowWidth); // eslint-disable-line

                  // TODO: how do we quarantee the order of breakpoint matches?
                  // The order of the media key value pairs should be constant
                  // but is that guaranteed? So if the keys are ordered from
                  // smallest screen size to largest everything should work ok...
                  const match = utils.resolveMediaRangeQuery(
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
          .map((compoundVariant) => {
            // eslint-disable-next-line
            const { css: _css, ...compounds } = compoundVariant;
            const compoundEntries = Object.entries(compounds);

            if (
              compoundEntries.every(([prop, value]) => props[prop] === value)
            ) {
              const key = utils.getCompoundKey(compoundEntries);
              return styleSheet[key];
            }
          })
          .filter(Boolean);
      }

      const cssStyles = props.css
        ? utils.processStyles({
            styles: props.css || {},
            theme: theme.values,
            config,
          })
        : {};

      const stitchesStyles = [
        styleSheet.base,
        ...variantStyles,
        ...compoundVariantStyles,
        cssStyles,
      ];

      const allStyles =
        typeof props.style === 'function'
          ? (...rest) =>
              [props.style(...rest), ...stitchesStyles].filter(Boolean)
          : [...stitchesStyles, props.style].filter(Boolean);

      const componentProps = {
        ...props,
        style: allStyles,
        ref,
      };

      if (typeof component === 'string') {
        return createElement(ReactNative[component], componentProps);
      } else if (
        typeof component === 'object' ||
        typeof component === 'function'
      ) {
        return createElement(component, componentProps);
      }

      return null;
    });

    return memo(Comp);
  }

  function css(...cssObjects) {
    return cssObjects.reduce((a, v) => merge(a, v), {});
  }

  return {
    styled,
    css,
    theme: themes[0].values,
    createTheme,
    useTheme,
    ThemeProvider,
    config,
    media: config.media,
    utils: config.utils,
  };
}

export const { styled, css } = createStitches();

export const defaultThemeMap = constants.DEFAULT_THEME_MAP;

export default createStitches;
