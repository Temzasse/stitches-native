/* eslint-disable */
// Based on Stitches TS typings
// https://github.com/modulz/stitches/blob/canary/packages/react/types/core.d.ts

import * as React from 'react';

import { ReactNativeProperties } from './react-native';

// prettier-ignore
export interface Properties<TLength = (string & {}) | 0> extends ReactNativeProperties<TLength> {}

export interface CSSPropertiesToTokenScale {
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

export declare const defaultThemeMap: CSSPropertiesToTokenScale;
export declare const $variants: unique symbol;
export declare const $media: unique symbol;

// prettier-ignore
export type StitchesExtractVariantsStyles<T> = T extends { [$variants]: infer V } ? V : {};

export interface ThemeRule {
  id: string;
  values: any; // TODO: fix type
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
  [k: string]: string | boolean;
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
  utils?: { [k in keyof Utils]: (config: UtilConfig<Medias, Theme, ThemeMap>) => (value: Utils[k]) => InternalCSS<Medias, Theme, Utils, ThemeMap> };
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
  utils: { [k in keyof Utils]: (config: UtilConfig<Medias, Theme, ThemeMap>) => (value: Utils[k]) => InternalCSS<Medias, Theme, Utils, ThemeMap> };
}

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
> = { [k in keyof Properties]?: (ThemeMap[k] extends keyof Theme ? `$${Extract<keyof Theme[ThemeMap[k]], string | number>}` : never) | Properties[k] } &
  { [k in `@${string & keyof Medias}`]?: FlatInternalCSS<Medias, Theme, Utils, ThemeMap> & { [k in string]: unknown } } &
  { [k in keyof Utils]?: Utils[k] };

// prettier-ignore
type InferRestVariants<Args extends any[]> = Args[0] & (HasTail<Args> extends true ? InferRestVariants<Tail<Args>> : {});

type HasTail<T extends any[]> = T extends [] | [any] ? false : true;

type Tail<T extends any[]> = ((...t: T) => any) extends (_: any, ...tail: infer _Tail) => any ? _Tail : []; // prettier-ignore

type OmitKey<T, U extends keyof any> = T & { [P in U]?: unknown };

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

  config: InternalConfig<A, B, C, ThemeMap>;

  css: {
    <Vars extends any[]>(
      ...styles: {
        [k in keyof Vars]: (
          | (LessInternalCSS<A, B, C, ThemeMap> & { variants?: Vars[k] & { [a in keyof Vars[k]]: { [b in keyof Vars[k][a]]: InternalCSS<A, B, C, ThemeMap> } } })
          | Record<string, InternalCSS<A, B, C, ThemeMap> | string | number>
        )
        & { defaultVariants?: { [a in keyof Vars[k]]?: keyof Vars[k][a] } }
        & { compoundVariants?: ({ [a in keyof Vars[k]]?: keyof Vars[k][a] } & { css?: InternalCSS<A, B, C, ThemeMap> })[] };
      }
    ): InternalCSS<A, B, C, ThemeMap>;
  };

  media: A;
  utils: C;

  theme: (theme: Partial<{ [TO in keyof B]: Partial<B[TO]> }>) => ThemeRule;
  useTheme: () => B;
  ThemeProvider: React.FunctionComponent<{ theme?: ThemeRule }>;
}

export type StrictMorphVariant<T> = T extends number
  ? `${T}` | T
  : T extends 'true'
  ? true | T
  : T extends 'false'
  ? false | T
  : T;

type MorphVariant<T> = T extends number
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

// prettier-ignore
export interface IStyledRule<
  Variants,
  Medias extends TMedias = TMedias,
  Theme extends TTheme = TTheme,
  Utils = {},
  ThemeMap = {}
> {
  (init?: VariantsCall<Variants, Medias> & { css?: InternalCSS<Medias, Theme, Utils, ThemeMap>; className?: string }): string;
  variants: Variants;
  [$media]: Medias;
  [$variants]: Variants;
}
