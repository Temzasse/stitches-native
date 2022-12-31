import merge from 'lodash.merge';

import React, {
  ForwardRefExoticComponent,
  createContext,
  createElement,
  forwardRef,
  memo,
  useContext,
  useMemo,
} from 'react';

import {
  flattenCompoundVariantStyles,
  flattenStyles,
  flattenVariantStyles,
} from './utils';

import {
  DEFAULT_THEME_MAP,
  EMPTY_THEME,
  StoredTheme,
  THEME_PROVIDER_MISSING_MESSAGE,
} from './constants';

import {
  useCompoundVariantStyles,
  useMediaQueries,
  useProcessedStyleSheet,
  useVariantStyles,
} from './hooks';

import { createStyleSheet, processStyles } from './styles';
import { processTheme } from './theme';
import { ConfigType, DefaultThemeMap } from '../types/config';
import Stitches from '../types/stitches';

/** @typedef {import('../types').__Stitches__} Stitches */
/** @typedef {import('../types').CreateStitches} CreateStitches */

// eslint-disable-next-line
const ReactNative = require('react-native');

/** @type {CreateStitches} */

export function createStitches<
  Media extends {} = {},
  Theme extends {} = {},
  ThemeMap extends {} = DefaultThemeMap,
  Utils extends {} = {}
>(config?: {
  media?: ConfigType.Media<Media>;
  theme?: ConfigType.Theme<Theme>;
  themeMap?: ConfigType.ThemeMap<ThemeMap>;
  utils?: ConfigType.Utils<Utils>;
}): Stitches<Media, Theme, ThemeMap, Utils>;
export function createStitches<
  Media extends {} = {},
  Theme extends {} = {},
  ThemeMap extends {} = DefaultThemeMap,
  Utils extends {} = {}
>(
  config: {
    media?: ConfigType.Media<Media>;
    theme?: ConfigType.Theme<Theme>;
    themeMap?: ConfigType.ThemeMap<ThemeMap>;
    utils?: ConfigType.Utils<Utils>;
  } = {}
): Stitches<Media, Theme, ThemeMap, Utils> {
  const themes: StoredTheme[] = [];

  if (config.theme) {
    const processedTheme = processTheme(config.theme);
    processedTheme.definition.__ID__ = 'theme-1';

    themes.push(processedTheme);
  } else {
    themes.push(EMPTY_THEME);
  }

  /** @type {Stitches['createTheme']} */
  function createTheme(theme) {
    const newTheme = processTheme(
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

  function useThemeInternal(): StoredTheme {
    const themeDefinition = useContext(ThemeContext);

    if (!themeDefinition) {
      throw new Error(THEME_PROVIDER_MISSING_MESSAGE);
    }

    const _theme = themes.find(
      (t) => t.definition.__ID__ === themeDefinition.__ID__
    );

    if (!_theme) {
      throw new Error(THEME_PROVIDER_MISSING_MESSAGE);
    }

    return _theme;
  }

  /** @type {Stitches['useTheme']} */
  function useTheme() {
    const themeDefinition = useContext(ThemeContext);

    if (!themeDefinition) {
      throw new Error(THEME_PROVIDER_MISSING_MESSAGE);
    }

    return themes.find((t) => t.definition.__ID__ === themeDefinition.__ID__)?.values; // prettier-ignore
  }

  /** @type {Stitches['styled']} */
  function styled(component, ...styleDefs) {
    const styleDef = styleDefs.reduce((a, v) => merge(a, v), {});

    const {
      defaultVariants = {},
      variants: _variants,
      compoundVariants: _compoundVariants,
      ..._styles
    } = styleDef;

    const media = config.media || {};
    const utils = config.utils || {};
    const variants = flattenVariantStyles(_variants || {}, utils);
    const compoundVariants = flattenCompoundVariantStyles(_compoundVariants || [], utils); // prettier-ignore
    const styles = flattenStyles(_styles || {}, utils);
    const styleSheets = {};

    let attrsFn;

    let Comp: ForwardRefExoticComponent<any> & { attrs?: any } = forwardRef(
      (props, ref) => {
        const theme = useThemeInternal();

        const baseStyleSheet = useMemo(() => {
          const existingSheet = styleSheets[theme.definition.__ID__];
          if (existingSheet) return existingSheet;

          styleSheets[theme.definition.__ID__] = createStyleSheet({
            styles,
            variants,
            compoundVariants,
            theme: theme.values,
            themeMap: config.themeMap,
          });

          return styleSheets[theme.definition.__ID__];
        }, [theme]);

        const activeMediaQueries = useMediaQueries(media);

        const styleSheet = useProcessedStyleSheet({
          media,
          activeMediaQueries,
          styleSheet: baseStyleSheet,
        });

        const variantStyles = useVariantStyles({
          props,
          variants,
          defaultVariants,
          media,
          activeMediaQueries,
          styleSheet,
        });

        const compoundVariantStyles = useCompoundVariantStyles({
          props,
          variants,
          defaultVariants,
          compoundVariants,
          styleSheet,
        });

        const cssStyles = props.css
          ? processStyles({
              styles: flattenStyles(props.css || {}, utils),
              theme: theme.values as Record<string, object>,
              themeMap: config.themeMap,
            })
          : {};

        const combinedStyles = [
          styleSheet.base,
          ...variantStyles,
          ...compoundVariantStyles,
          cssStyles,
        ];

        const style =
          typeof props.style === 'function'
            ? (...rest) =>
                [props.style(...rest), ...combinedStyles].filter(Boolean)
            : [...combinedStyles, props.style].filter(Boolean);

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
          style,
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
      }
    );

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
  } as unknown as Stitches<Media, Theme, ThemeMap, Utils>;
}

export const { styled, css } = createStitches();

export const defaultThemeMap = DEFAULT_THEME_MAP;

export default createStitches;
