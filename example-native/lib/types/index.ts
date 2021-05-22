import React from 'react';
import { LiteralUnion, PartialDeep } from 'type-fest';

import {
  AnyStyleProperty,
  BorderStyle,
  FontWeight,
  PolymorphicProps,
  StrictStyleProperty,
  StyledPrimitive,
  StyleProperty,
} from './react-native';

import {
  COLOR_PROPERTIES,
  SPACE_PROPERTIES,
  RADII_PROPERTIES,
  SIZE_PROPERTIES,
  FONT_PROPERTIES,
  FONT_SIZE_PROPERTIES,
  FONT_WEIGHT_PROPERTIES,
  LINE_HEIGHT_PROPERTIES,
  LETTER_SPACING_PROPERTIES,
  Z_INDEX_PROPERTIES,
  BORDER_WIDTH_PROPERTIES,
  BORDER_STYLE_PROPERTIES,
  DEFAULT_THEME_MAP,
} from '../constants';

type ColorProperty = keyof typeof COLOR_PROPERTIES;
type SpaceProperty = keyof typeof SPACE_PROPERTIES;
type SizeProperty = keyof typeof SIZE_PROPERTIES;
type RadiiProperty = keyof typeof RADII_PROPERTIES;
type FontProperty = keyof typeof FONT_PROPERTIES;
type FontSizeProperty = keyof typeof FONT_SIZE_PROPERTIES;
type FontWeightProperty = keyof typeof FONT_WEIGHT_PROPERTIES;
type LineHeightProperty = keyof typeof LINE_HEIGHT_PROPERTIES;
type LetterSpacingProperty = keyof typeof LETTER_SPACING_PROPERTIES;
type ZIndexProperty = keyof typeof Z_INDEX_PROPERTIES;
type BorderWidthProperty = keyof typeof BORDER_WIDTH_PROPERTIES;
type BorderStyleProperty = keyof typeof BORDER_STYLE_PROPERTIES;

export type ThemeToken = {
  [name: string]: string | number;
};

type TokenizedValue<T extends string | number | symbol> = T extends
  | string
  | number
  ? `$${T}`
  : never;

type TokenizedStyleProperty<S extends AnyStyleProperty, C extends Config> = {
  [K in keyof S]?: K extends ColorProperty
    ? LiteralUnion<TokenizedValue<keyof NonNullable<C['theme']>['colors']>, string> // prettier-ignore
    : K extends SpaceProperty
    ? LiteralUnion<TokenizedValue<keyof NonNullable<C['theme']>['space']>, string | number> // prettier-ignore
    : K extends SizeProperty
    ? LiteralUnion<TokenizedValue<keyof NonNullable<C['theme']>['sizes']>, string | number> // prettier-ignore
    : K extends RadiiProperty
    ? TokenizedValue<keyof NonNullable<C['theme']>['radii']> | number
    : K extends FontProperty
    ? LiteralUnion<TokenizedValue<keyof NonNullable<C['theme']>['fonts']>, string> // prettier-ignore
    : K extends FontSizeProperty
    ? LiteralUnion<TokenizedValue<keyof NonNullable<C['theme']>['fontSizes']>, number> // prettier-ignore
    : K extends FontWeightProperty
    ? TokenizedValue<keyof NonNullable<C['theme']>['fontWeights']> | FontWeight
    : K extends LineHeightProperty
    ? LiteralUnion<TokenizedValue<keyof NonNullable<C['theme']>['lineHeights']>, number> // prettier-ignore
    : K extends LetterSpacingProperty
    ? LiteralUnion<TokenizedValue<keyof NonNullable<C['theme']>['letterSpacings']>, number> // prettier-ignore
    : K extends ZIndexProperty
    ? LiteralUnion<TokenizedValue<keyof NonNullable<C['theme']>['zIndices']>, number> // prettier-ignore
    : K extends BorderWidthProperty
    ? TokenizedValue<keyof NonNullable<C['theme']>['borderWidths']> // TODO: why does adding `number` break autocomplete?
    : K extends BorderStyleProperty
    ? TokenizedValue<keyof NonNullable<C['theme']>['borderStyles']> | BorderStyle // prettier-ignore
    : K extends string
    ? StrictStyleProperty<K>
    : S[K];
};

// interface CompoundVariant<T extends StyledComponent, C extends Config> {
//   css: TokenizedStyleProperty<StyleProperty<T>, C>;
//   [variant in V]: string;
// }

type Variant<T extends StyledPrimitive, C extends Config> = Record<
  string,
  {
    [variant: string]: TokenizedStyleProperty<StyleProperty<T>, C>;
  }
>;

type ComponentPropValue<T> = T extends 'true' | 'false' ? boolean : T;

type MediaKey<K extends string | number | symbol> = K extends string | number
  ? `@${K}`
  : never;

export type ThemeDefinition = {
  id: string;
  values: Config['theme'];
};

export type ThemeMap = PartialDeep<typeof DEFAULT_THEME_MAP>;

export type Theme = {
  borderStyles?: ThemeToken;
  borderWidths?: ThemeToken;
  colors?: ThemeToken;
  fonts?: ThemeToken;
  fontSizes?: ThemeToken;
  fontWeights?: ThemeToken;
  letterSpacings?: ThemeToken;
  lineHeights?: ThemeToken;
  radii?: ThemeToken;
  sizes?: ThemeToken;
  space?: ThemeToken;
  zIndices?: ThemeToken;
  // shadows?: ThemeToken;
};

export type StyledConfig<
  T extends StyledPrimitive,
  C extends Config
> = TokenizedStyleProperty<StyleProperty<T>, C> & {
  variants?: Variant<T, C>;
  compoundVariants?: Array<any>;
  defaultVariants?: { [prop: string]: string };
} & {
    [K in keyof C['utils']]?: string | number;
  } &
  {
    [K in keyof C['media']]?: TokenizedStyleProperty<StyleProperty<T>, C>;
  };

export type CssFnStyles<
  T extends StyledPrimitive,
  C extends Config
> = TokenizedStyleProperty<StyleProperty<T>, C>;

export type ComponentProps<
  T extends StyledPrimitive,
  C extends Config,
  V extends Variant<T, C>
> = PolymorphicProps<T> & {
  children?: React.ReactNode;
  css?: TokenizedStyleProperty<StyleProperty<T>, C>;
} & {
    [K in keyof V]:
      | ComponentPropValue<keyof V[K]>
      | { [M in MediaKey<keyof C['media']>]: string | number };
  };

export type Config = {
  theme?: Theme;
  media?: any;
  utils?: {
    [util: string]: (config: Config) => (value: any) => any;
  };
  themeMap?: ThemeMap;
};
