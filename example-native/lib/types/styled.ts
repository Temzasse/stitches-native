// Based on Stitches TS typings
// https://github.com/modulz/stitches/blob/canary/packages/react/types/styled.d.ts

import * as React from 'react';

import {
  $media,
  $variants,
  CSSPropertiesToTokenScale,
  IConfig,
  InternalCSS,
  LessInternalCSS,
  StitchesExtractVariantsStyles,
  StrictMorphVariant,
  TMedias,
  TStyledSheet,
  TTheme,
  TThemeMap,
  VariantsCall,
} from './core';

import {
  ReactNativeElements,
  ReactNativeElementsKey,
  ReactNativeElementType,
} from './react-native';

declare const $elm: unique symbol;

// prettier-ignore
type ComponentInfer<T> = T extends ReactNativeElementsKey | React.ComponentType<any> ? T : never

// TODO: fix `ComponentInfer` TS error
// prettier-ignore
interface StitchesComponentWithAutoCompleteForReactComponents<
  DefaultElement,
  Variants = {},
  Medias extends TMedias = TMedias,
  Theme = {},
  Utils = {},
  ThemeMap = {}
> extends React.ForwardRefExoticComponent<Omit<React.ComponentPropsWithRef<ComponentInfer<DefaultElement>>, keyof Variants | 'css'> & { css?: InternalCSS<Medias, Theme, Utils, ThemeMap> } & VariantsCall<Variants, Medias>> {
  // React components have higher priority here for autocomplete
  <As extends React.ComponentType = DefaultElement extends React.ComponentType ? DefaultElement : never>(
    props: VariantsCall<Variants, Medias> & Omit<React.ComponentPropsWithRef<As>, keyof Variants | 'css'> & { css?: InternalCSS<Medias, Theme, Utils, ThemeMap> }
  ): JSX.Element;

  // JSX elements
  <Elm extends ReactNativeElementsKey = DefaultElement extends ReactNativeElementsKey ? DefaultElement : never>(
    props: VariantsCall<Variants, Medias> & Omit<ReactNativeElements[Elm], keyof Variants | 'css'> & { css?: InternalCSS<Medias, Theme, Utils, ThemeMap> }
  ): JSX.Element;

  variants: Variants;

  [$media]: Medias;
  [$variants]: Variants;
}

// TODO: fix `ComponentInfer` TS error
// prettier-ignore
interface StitchesComponentWithAutoCompleteForJSXElements<
  DefaultElement extends string,
  Variants = {},
  Medias extends TMedias = TMedias,
  Theme = {},
  Utils = {},
  ThemeMap = {}
> extends React.ForwardRefExoticComponent<Omit<React.ComponentPropsWithRef<ComponentInfer<DefaultElement>>, keyof Variants | 'css'> & { css?: InternalCSS<Medias, Theme, Utils, ThemeMap> } & VariantsCall<Variants, Medias>> {
  // JSX elements have higher priority here when it comes to autocomplete
  <Elm extends ReactNativeElementsKey = DefaultElement extends ReactNativeElementsKey ? DefaultElement : never>(
    props: VariantsCall<Variants, Medias> & Omit<ReactNativeElements[Elm], keyof Variants | 'css'> & { css?: InternalCSS<Medias, Theme, Utils, ThemeMap> },
  ): JSX.Element

  // React component
  <As extends React.ComponentType = DefaultElement extends React.ComponentType ? DefaultElement : never>(
    props: VariantsCall<Variants, Medias> & Omit<React.ComponentPropsWithRef<As>, keyof Variants | 'css'> & { css?: InternalCSS<Medias, Theme, Utils, ThemeMap> },
  ): JSX.Element

  variants: Variants

  [$media]: Medias
  [$elm]: DefaultElement
  [$variants]: Variants
}

// prettier-ignore
type StyledInstance<
  Medias extends TMedias = TMedias,
  Theme extends TTheme = {},
  Utils = {},
  ThemeMap = {}
> = {
  <E extends ReactNativeElementType, Variants, CloneVariants extends Variants>(
    elm: E,
    styles: ((LessInternalCSS<Medias, Theme, Utils, ThemeMap> & { [k in string]: unknown }) | Record<string, InternalCSS<Medias, Theme, Utils, ThemeMap>>)
      & { variants?: { [k in keyof Variants]: { [b in keyof Variants[k]]: InternalCSS<Medias, Theme, Utils, ThemeMap> } } }
      & { defaultVariants?: { [k in keyof CloneVariants]?: StrictMorphVariant<keyof CloneVariants[k]> } }
      & { compoundVariants?: ({ [k in keyof CloneVariants]?: StrictMorphVariant<keyof CloneVariants[k]> } & { css?: InternalCSS<Medias, Theme, Utils, ThemeMap> })[] }
  ): E extends string
    // JSX elements
    ? StitchesComponentWithAutoCompleteForJSXElements<E, Variants & StitchesExtractVariantsStyles<E>, Medias, Theme, Utils, ThemeMap>
    // if it's a stitches component...
    : E extends { [$elm]: infer DeepStitchesComponentType }
    // reach in and pull its type to provide better types
    ? StitchesComponentWithAutoCompleteForJSXElements<string & DeepStitchesComponentType, Variants & StitchesExtractVariantsStyles<E>, Medias, Theme, Utils, ThemeMap>
    // normal react component
    : StitchesComponentWithAutoCompleteForReactComponents<E, Variants & StitchesExtractVariantsStyles<E>, Medias, Theme, Utils, ThemeMap>;
} & ProxyStyledElements<Medias, Theme, Utils, ThemeMap>;

// prettier-ignore
export type ProxyStyledElements<
  Medias extends TMedias = TMedias,
  Theme extends TTheme = {},
  Utils = {},
  ThemeMap = {}
> = {
  [ElKey in ReactNativeElementsKey]: <E extends ReactNativeElementType = ElKey, Variants = {}, CloneVariants extends Variants = {}>(
    styled: (
      ((LessInternalCSS<Medias, Theme, Utils, ThemeMap> & { [k in string]: unknown }) | Record<string, InternalCSS<Medias, Theme, Utils, ThemeMap>>)
      & { variants?: { [k in keyof Variants]: { [b in keyof Variants[k]]: InternalCSS<Medias, Theme, Utils, ThemeMap> } } }
      & { defaultVariants?: { [k in keyof CloneVariants]?: StrictMorphVariant<keyof CloneVariants[k]> } }
      & { compoundVariants?: ({ [k in keyof CloneVariants]?: StrictMorphVariant<keyof CloneVariants[k]> } & { css?: InternalCSS<Medias, Theme, Utils, ThemeMap> })[] }
    )
  ) => E extends string
    // JSX elements
    ? StitchesComponentWithAutoCompleteForJSXElements<E, Variants & StitchesExtractVariantsStyles<E>, Medias, Theme, Utils, ThemeMap>
    // if it's a stitches component...
    : E extends { [$elm]: infer DeepStitchesComponentType }
    // reach in and pull its type to provide better types
    ? StitchesComponentWithAutoCompleteForJSXElements<string & DeepStitchesComponentType, Variants & StitchesExtractVariantsStyles<E>, Medias, Theme, Utils, ThemeMap>
    // normal react component
    : StitchesComponentWithAutoCompleteForReactComponents<E, Variants & StitchesExtractVariantsStyles<E>, Medias, Theme, Utils>;
};

// prettier-ignore
export type ReactFactory = <
  Medias extends TMedias = TMedias,
  Theme extends TTheme = {},
  Utils = {},
  ThemeMap extends TThemeMap = CSSPropertiesToTokenScale
>(
  _config?: IConfig<Medias, Theme, Utils, ThemeMap>
) => TStyledSheet<Medias, Theme, Utils, ThemeMap> & { styled: StyledInstance<Medias & { initial: '' }, Theme, Utils, ThemeMap> };
