import merge from 'lodash.merge';
import { PixelRatio, useWindowDimensions } from 'react-native';

import React, {
  createContext,
  createElement,
  forwardRef,
  memo,
  useMemo,
  useContext,
} from 'react';

import * as utils from './utils';
import * as constants from './constants';

/** @typedef {import('../types').__Stitches__} Stitches */
/** @typedef {import('../types').CreateStitches} CreateStitches */

// eslint-disable-next-line
const ReactNative = require('react-native');

/** @type {CreateStitches} */
export function createStitches(config = {}) {
  const themes = [];

  if (config.theme) {
    const processedTheme = utils.processTheme(config.theme);
    processedTheme.definition.__ID__ = 'theme-1';

    themes.push(processedTheme);
  } else {
    themes.push(constants.EMPTY_THEME);
  }

  /** @type {Stitches['createTheme']} */
  function createTheme(theme) {
    const newTheme = utils.processTheme(
      Object.entries(config.theme || {}).reduce((acc, [key, val]) => {
        acc[key] = { ...val, ...theme[key] };
        return acc;
      }, {})
    );

    newTheme.definition.__ID__ = `theme-${themes.length + 1}`;

    themes.push(newTheme);

    return newTheme.definition;
  }

  const defaultTheme = themes[0].definition;
  const ThemeContext = createContext(defaultTheme);

  /** @type {Stitches['ThemeProvider']} */
  function ThemeProvider({ theme = defaultTheme, children }) {
    return (
      <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
    );
  }

  function useThemeInternal() {
    const themeDefinition = useContext(ThemeContext);

    if (!themeDefinition) {
      throw new Error(constants.THEME_PROVIDER_MISSING_MESSAGE);
    }

    return themes.find((x) => x.definition.__ID__ === themeDefinition.__ID__);
  }

  /** @type {Stitches['useTheme']} */
  function useTheme() {
    const themeDefinition = useContext(ThemeContext);

    if (!themeDefinition) {
      throw new Error(constants.THEME_PROVIDER_MISSING_MESSAGE);
    }

    return themes.find((x) => x.definition.__ID__ === themeDefinition.__ID__).values; // prettier-ignore
  }

  /** @type {Stitches['styled']} */
  function styled(component, ...styleObjects) {
    const styleObject = styleObjects.reduce((a, v) => merge(a, v), {});

    const {
      variants = {},
      compoundVariants = [],
      defaultVariants = {},
      ..._styles
    } = styleObject;

    const styles = _styles;

    const styleSheets = {};

    let attrsFn;

    let Comp = forwardRef((props, ref) => {
      const theme = useThemeInternal();

      const styleSheet = useMemo(() => {
        const _styleSheet = styleSheets[theme.definition.__ID__];
        if (_styleSheet) {
          return _styleSheet;
        }
        styleSheets[theme.definition.__ID__] = utils.createStyleSheet({
          styles,
          config,
          theme,
          variants,
          compoundVariants,
        });
        return styleSheets[theme.definition.__ID__];
      }, [theme]);

      const { width: windowWidth } = useWindowDimensions();

      let variantStyles = [];
      let compoundVariantStyles = [];

      const matchedMedias = useMemo(() => {
        if (typeof config.media === 'object') {
          const correctedWindowWidth =
            PixelRatio.getPixelSizeForLayoutSize(windowWidth);

          // TODO: how do we quarantee the order of breakpoint matches?
          // The order of the media key value pairs should be constant
          // but is that guaranteed? So if the keys are ordered from
          // smallest screen size to largest everything should work ok...
          const matchedMedias = utils.resolveMediaRangeQuery(
            config.media,
            correctedWindowWidth
          );

          return matchedMedias;
        }

        return [];
      }, [windowWidth]);

      if (variants) {
        variantStyles = Object.keys(variants)
          .map((prop) => {
            let propValue = props[prop];

            if (propValue === undefined) {
              propValue = defaultVariants[prop];
            }

            const styleSheetKey = `${prop}_${propValue}`;

            if (typeof propValue !== 'object') return styleSheet[styleSheetKey];

            const matchedMediasDetected = [
              {
                mediaKey: 'initial',
                breakpoint: '@initial',
              },
              ...matchedMedias,
            ];

            // NOTE: Even if multiple values are matched, restict variant value is last matched and
            // compensated to be determined uniquely.
            const finalVariantStyle = matchedMediasDetected.reduce(
              (currentStyle, matchedMedia) => {
                const breakpoint = matchedMedia.breakpoint;
                if (breakpoint && propValue[breakpoint] !== undefined) {
                  const styleSheetKey = `${prop}_${propValue[breakpoint]}`;
                  const extractedStyle = styleSheet[styleSheetKey];
                  if (extractedStyle) return extractedStyle;
                }
                return currentStyle;
              },
              {}
            );

            return finalVariantStyle;
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
              compoundEntries.every(([prop, value]) => {
                const propValue = props[prop] ?? defaultVariants[prop];
                return propValue === value;
              })
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
      ].map((style) => utils.applyMediaStyles(style, matchedMedias));

      const allStyles =
        typeof props.style === 'function'
          ? (...rest) =>
              [props.style(...rest), ...stitchesStyles].filter(Boolean)
          : [...stitchesStyles, props.style].filter(Boolean);

      let attrsProps = {};

      if (typeof attrsFn === 'function') {
        attrsProps = attrsFn({ ...props, theme: theme.values });
      }

      const propsWithoutVariant = { ...props };

      for (const variantKey of Object.keys(variants)) {
        delete propsWithoutVariant[variantKey];
      }

      const componentProps = {
        ...attrsProps,
        ...propsWithoutVariant,
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

    Comp = memo(Comp);

    Comp.attrs = (cb) => {
      attrsFn = cb;
      return Comp;
    };

    return Comp;
  }

  /** @type {Stitches['css']} */
  function css(...cssObjects) {
    return cssObjects.reduce((a, v) => merge(a, v), {});
  }

  return {
    styled,
    css,
    theme: themes[0].definition,
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
