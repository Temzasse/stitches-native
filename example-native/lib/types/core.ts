// Based on Stitches TS typings
// https://github.com/modulz/stitches/blob/canary/packages/react/types/core.d.ts

import { ReactNativeProperties } from './react-native';

// prettier-ignore
export interface Properties<TLength = (string & {}) | 0> extends ReactNativeProperties<TLength> {}

export interface CSSPropertiesToTokenScale {
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

  top: 'space';
  right: 'space';
  bottom: 'space';
  left: 'space';

  fontSize: 'fontSizes';

  backgroundColor: 'colors';
  border: 'colors';
  borderBottom: 'colors';
  borderBottomColor: 'colors';
  borderColor: 'colors';
  borderLeft: 'colors';
  borderLeftColor: 'colors';
  borderRight: 'colors';
  borderRightColor: 'colors';
  borderTop: 'colors';
  borderTopColor: 'colors';
  color: 'colors';
  textDecorationColor: 'colors';

  fontFamily: 'fonts';

  fontWeight: 'fontWeights';
  lineHeight: 'lineHeights';

  letterSpacing: 'letterSpacings';

  width: 'sizes';
  minWidth: 'sizes';
  maxWidth: 'sizes';
  height: 'sizes';
  minHeight: 'sizes';
  maxHeight: 'sizes';
  flexBasis: 'sizes';

  borderWidth: 'borderWidths';
  borderTopWidth: 'borderWidths';
  borderLeftWidth: 'borderWidths';
  borderRightWidth: 'borderWidths';
  borderBottomWidth: 'borderWidths';
  borderEndWidth: 'borderWidths';
  borderStartWidth: 'borderWidths';

  borderStyle: 'borderStyles';

  borderRadius: 'radii';
  borderTopLeftRadius: 'radii';
  borderTopRightRadius: 'radii';
  borderBottomRightRadius: 'radii';
  borderBottomLeftRadius: 'radii';
  borderBottomEndRadius: 'radii';
  borderBottomStartRadius: 'radii';
  borderTopEndRadius: 'radii';
  borderTopStartRadius: 'radii';

  // TODO
  // shadowColor: 'shadows';
  // textShadowColor: 'shadows';

  zIndex: 'zIndices';
}

export declare const defaultThemeMap: CSSPropertiesToTokenScale;
export declare const $variants: unique symbol;
export declare const $media: unique symbol;

// prettier-ignore
export type StitchesVariants<T> = T extends { [$variants]: infer V; [$media]: infer C } ? VariantsCall<V, C> : {};

// prettier-ignore
export type StitchesExtractVariantsStyles<T> = T extends { [$variants]: infer V } ? V : {};

export type StyledSheetCallback = (...cssText: string[]) => void;

export interface ThemeRule {
  toString(): string;
  className: string;
  cssText: string;
  root: string;
}

export interface StyledExpression {
  (): string;
  toString(): string;
  className: string;
  classNames: string[];
  props: any;
  selector: string;
}

export interface EmptyTheme {
  colors?: {};
  space?: {};
  fontSizes?: {};
  fonts?: {};
  fontWeights?: {};
  lineHeights?: {};
  letterSpacings?: {};
  sizes?: {};
  borderWidths?: {};
  borderStyles?: {};
  radii?: {};
  shadows?: {};
  zIndices?: {};
}

export interface TMedias {
  initial: string;
  [k: string]: string;
}

export type TTheme = {
  [k in keyof EmptyTheme]?: { [b: string]: number | string };
};

export type TThemeMap = {
  [k in keyof Properties]?: keyof EmptyTheme;
};

// prettier-ignore
export interface IConfig<
  Medias extends TMedias = TMedias,
  Theme extends TTheme = TTheme,
  Utils = {},
  ThemeMap = {}
> {
  media?: { [k in keyof Medias]?: Medias[k] };
  theme?: { [k in keyof Theme]: k extends keyof EmptyTheme ? Theme[k] : never } & { [k in keyof EmptyTheme]?: k extends keyof Theme ? Theme[k] : never };
  themeMap?: { [k in keyof ThemeMap]?: ThemeMap[k] };
  utils?: {
    [k in keyof Utils]: (config: UtilConfig<Medias, Theme, ThemeMap>) => (value: Utils[k]) => InternalCSS<Medias, Theme, Utils, ThemeMap>;
  };
}

interface UtilConfig<Medias, Theme, ThemeMap> {
  media: Medias;
  theme: Theme;
  themeMap: ThemeMap;
}

// prettier-ignore
export interface InternalConfig<
  Medias extends TMedias = TMedias,
  Theme extends TTheme = TTheme,
  Utils = {},
  ThemeMap = {}
> {
  media: Medias;
  theme: Theme;
  themeMap: ThemeMap;
  utils: {
    [k in keyof Utils]: (config: UtilConfig<Medias, Theme, ThemeMap>) => (value: Utils[k]) => InternalCSS<Medias, Theme, Utils, ThemeMap>;
  };
}

// prettier-ignore
export type MapUtils<T> = {
  [k in keyof T]: T[k] extends (theme: any) => (value: infer V) => any ? V : never;
};

// prettier-ignore
export type InternalCSS<
  Medias extends TMedias = TMedias,
  Theme extends TTheme = TTheme,
  Utils = {},
  ThemeMap extends { [k in keyof Properties]?: keyof Theme } = CSSPropertiesToTokenScale
> = FlatInternalCSS<Medias, Theme, Utils, ThemeMap> & {
  [k: string]:
    | InternalCSS<Medias, Theme, Utils, ThemeMap>
    | number
    | string
    | undefined
    | { [k: string]: InternalCSS<Medias, Theme, Utils, ThemeMap> };
};

// prettier-ignore
export type LessInternalCSS<
  Medias extends TMedias = TMedias,
  Theme extends TTheme = TTheme,
  Utils = {},
  ThemeMap extends { [k in keyof Properties]?: keyof Theme } = CSSPropertiesToTokenScale
> = FlatInternalCSS<Medias, Theme, Utils, ThemeMap>;

// prettier-ignore
type FlatInternalCSS<
  Medias extends TMedias = TMedias,
  Theme extends TTheme = TTheme,
  Utils = {},
  ThemeMap extends { [k in keyof Properties]?: keyof Theme } = CSSPropertiesToTokenScale
> = {
  [k in keyof Properties]?:
    | (ThemeMap[k] extends keyof Theme ? `$${Extract<keyof Theme[ThemeMap[k]], string | number>}` : never)
    | Properties[k];
} &
  { [k in `@${string & keyof Medias}`]?: FlatInternalCSS<Medias, Theme, Utils, ThemeMap> & { [k in string]: unknown } } &
  { [k in keyof Utils]?: Utils[k] };

// prettier-ignore
type InferRestVariants<Args extends any[]> = Args[0] & (HasTail<Args> extends true ? InferRestVariants<Tail<Args>> : {});

type HasTail<T extends any[]> = T extends [] | [any] ? false : true;

type Tail<T extends any[]> = ((...t: T) => any) extends (_: any, ...tail: infer _Tail) => any ? _Tail : []; // prettier-ignore

type OmitKey<T, U extends keyof any> = T & { [P in U]?: unknown };

type ThemeToken = {
  value: string;
  token: string;
  scale: string;
  computedValue: string;
  variable: string;
} & string;

// prettier-ignore
export interface TStyledSheet<
  A extends TMedias = TMedias,
  B extends TTheme = TTheme,
  C = {},
  ThemeMap = {}
> {
  <Vars extends any[]>(
    ...styles: { [k in keyof Vars]: OmitKey<InternalCSS<A, B, C, ThemeMap>, 'variants'> & { variants?: unknown } }
  ): IStyledRule<InferRestVariants<Vars>, A, B, C, ThemeMap>;

  theme: {
    (theme: Partial<{ [TO in keyof B]: Partial<B[TO]> }>): ThemeRule & string;
    (themeName: string, theme: Partial<{ [TO in keyof B]: Partial<B[TO]> }>): ThemeRule & string;
  } & {
    [TO in keyof B]: { [k in keyof B[TO]]: ThemeToken };
  };

  config: InternalConfig<A, B, C, ThemeMap>;

  css: {
    <Vars extends any[]>(
      ...styles: {
        [k in keyof Vars]: (
          | (LessInternalCSS<A, B, C, ThemeMap> & { variants?: Vars[k] & { [a in keyof Vars[k]]: { [b in keyof Vars[k][a]]: InternalCSS<A, B, C, ThemeMap> } } })
          | Record<string, InternalCSS<A, B, C, ThemeMap> | string | number>
        ) & {
          defaultVariants?: { [a in keyof Vars[k]]?: keyof Vars[k][a] };
        } & {
          compoundVariants?: ({ [a in keyof Vars[k]]?: keyof Vars[k][a] } & { css?: InternalCSS<A, B, C, ThemeMap> })[];
        };
      }
    ): IStyledRule<InferRestVariants<Vars>, A, B, C, ThemeMap>;
  };

  media: A;
  utils: C;

  ThemeProvider: any; // TODO: figure out type
}

export type StrictMorphVariant<T> = T extends number
  ? `${T}` | T
  : T extends 'true'
  ? true | T
  : T extends 'false'
  ? false | T
  : T;

export type MorphVariant<T> = T extends number
  ? `${T}` | T
  : T extends 'true'
  ? boolean | T
  : T extends 'false'
  ? boolean | T
  : T extends `${number}`
  ? number | T
  : T;

export type VariantsCall<Variants, Medias> = {
  [k in keyof Variants]?: MorphVariant<keyof Variants[k]> | { [I in keyof Medias]?: MorphVariant<keyof Variants[k]> }; // prettier-ignore
};

export type StitchesCss<T> = T extends {
  config: {
    media: infer Medias;
    theme: infer Theme;
    utils: infer Utils;
    themeMap: infer ThemeMap;
  };
}
  ? InternalCSS<
      Medias extends TMedias ? Medias : never,
      Theme extends TTheme ? Theme : never,
      MapUtils<Utils>,
      ThemeMap
    >
  : never;

// prettier-ignore
export interface IStyledRule<
  Variants,
  Medias extends TMedias = TMedias,
  Theme extends TTheme = TTheme,
  Utils = {},
  ThemeMap = {}
> {
  (init?: VariantsCall<Variants, Medias> & { css?: InternalCSS<Medias, Theme, Utils, ThemeMap>; className?: string }): StyledExpression & string;
  variants: Variants;
  [$media]: Medias;
  [$variants]: Variants;
}
