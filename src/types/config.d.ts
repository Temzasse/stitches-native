/* eslint-disable */
import type * as CSSUtil from './css-util';
import type Stitches from './stitches';

/** Configuration Interface */
declare namespace ConfigType {
  /** Media interface. */
  export type Media<T = {}> = {
    [name in keyof T]: T[name] extends string ? T[name] : string | boolean;
  };

  /** Theme interface. */
  export type Theme<T = {}> = {
    borderStyles?: { [token in number | string]: boolean | number | string };
    borderWidths?: { [token in number | string]: boolean | number | string };
    colors?: { [token in number | string]: boolean | number | string };
    fonts?: { [token in number | string]: boolean | number | string };
    fontSizes?: { [token in number | string]: boolean | number | string };
    fontWeights?: { [token in number | string]: boolean | number | string };
    letterSpacings?: { [token in number | string]: boolean | number | string };
    lineHeights?: { [token in number | string]: boolean | number | string };
    radii?: { [token in number | string]: boolean | number | string };
    sizes?: { [token in number | string]: boolean | number | string };
    space?: { [token in number | string]: boolean | number | string };
    zIndices?: { [token in number | string]: boolean | number | string };
  } & {
    [Scale in keyof T]: {
      [Token in keyof T[Scale]]: T[Scale][Token] extends
        | boolean
        | number
        | string
        ? T[Scale][Token]
        : boolean | number | string;
    };
  };

  /** ThemeMap interface. */
  export type ThemeMap<T = {}> = {
    [Property in keyof T]: T[Property] extends string ? T[Property] : string;
  };

  /** Utility interface. */
  export type Utils<T = {}> = {
    [Property in keyof T]: T[Property] extends (value: infer V) => {}
      ?
          | T[Property]
          | ((value: V) => {
              [K in keyof CSSUtil.CSSProperties]?: CSSUtil.CSSProperties[K] | V;
            })
      : never;
  };
}

/** Default ThemeMap. */
export interface DefaultThemeMap {
  backgroundColor: 'colors';
  border: 'colors';
  borderBottomColor: 'colors';
  borderColor: 'colors';
  borderEndColor: 'colors';
  borderLeftColor: 'colors';
  borderRightColor: 'colors';
  borderStartColor: 'colors';
  borderTopColor: 'colors';
  color: 'colors';
  overlayColor: 'colors';
  shadowColor: 'colors';
  textDecoration: 'colors';
  textShadowColor: 'colors';
  tintColor: 'colors';

  borderBottomLeftRadius: 'radii';
  borderBottomRightRadius: 'radii';
  borderBottomStartRadius: 'radii';
  borderBottomEndRadius: 'radii';
  borderRadius: 'radii';
  borderTopLeftRadius: 'radii';
  borderTopRightRadius: 'radii';
  borderTopStartRadius: 'radii';
  borderTopEndRadius: 'radii';

  bottom: 'space';
  left: 'space';
  margin: 'space';
  marginBottom: 'space';
  marginEnd: 'space';
  marginHorizontal: 'space';
  marginLeft: 'space';
  marginRight: 'space';
  marginStart: 'space';
  marginTop: 'space';
  marginVertical: 'space';
  padding: 'space';
  paddingBottom: 'space';
  paddingEnd: 'space';
  paddingHorizontal: 'space';
  paddingLeft: 'space';
  paddingRight: 'space';
  paddingStart: 'space';
  paddingTop: 'space';
  paddingVertical: 'space';
  right: 'space';
  top: 'space';

  flexBasis: 'sizes';
  height: 'sizes';
  maxHeight: 'sizes';
  maxWidth: 'sizes';
  minHeight: 'sizes';
  minWidth: 'sizes';
  width: 'sizes';

  fontFamily: 'fonts';

  fontSize: 'fontSizes';

  fontWeights: 'fontWeights';

  lineHeight: 'lineHeights';

  letterSpacing: 'letterSpacings';

  zIndex: 'zIndices';

  borderWidth: 'borderWidths';
  borderTopWidth: 'borderWidths';
  borderRightWidth: 'borderWidths';
  borderBottomWidth: 'borderWidths';
  borderLeftWidth: 'borderWidths';

  borderStyle: 'borderStyles';
}

/** Returns a function used to create a new Stitches interface. */
export type CreateStitches = {
  <
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
};
