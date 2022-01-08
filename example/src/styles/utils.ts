import { CSSProperties } from 'react';
import { StyleSheet } from 'react-native';
import type * as Stitches from 'stitches-native';

export type TypographyVariant =
  | 'body'
  | 'bodySmall'
  | 'bodyExtraSmall'
  | 'title1'
  | 'title2'
  | 'title3';

type TypographyVariantVar = `$${TypographyVariant}`;

// TODO: is there a way to type tokens? Using `CSS` from `styled.ts` doesn't work
// because it causes a circular type dependency since `typography` is used in `utils`.
const typographyVariants: {
  [variant in TypographyVariantVar]: CSSProperties;
} = {
  $title1: {
    fontSize: '$xxl',
    fontWeight: '$bold',
  },
  $title2: {
    fontSize: '$xl',
    fontWeight: '$bold',
  },
  $title3: {
    fontSize: '$lg',
    fontWeight: '$bold',
  },
  $body: {
    fontSize: '$md',
    fontWeight: '$normal',
  },
  $bodySmall: {
    fontSize: '$sm',
    fontWeight: '$normal',
  },
  $bodyExtraSmall: {
    fontSize: '$xs',
    fontWeight: '$semibold',
  },
};

export const typography = (value: TypographyVariantVar) => {
  return typographyVariants[value];
};

export const size = (value: Stitches.PropertyValue<'width'>) => ({
  width: value,
  height: value,
});

export const shadow = (level: 'none' | 'small' | 'medium' | 'large') => {
  return {
    none: {
      elevation: 0,
      shadowOffset: { width: 0, height: 0 },
      shadowRadius: 0,
      shadowOpacity: 0,
      shadowColor: '#000',
    },
    small: {
      elevation: 2,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 3,
      shadowOpacity: 0.1,
      shadowColor: '#000',
    },
    medium: {
      elevation: 5,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 6,
      shadowOpacity: 0.2,
      shadowColor: '#000',
    },
    large: {
      elevation: 10,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      shadowOpacity: 0.4,
      shadowColor: '#000',
    },
  }[level];
};

export const flexCenter = (
  value?: Stitches.PropertyValue<'flexDirection'>
) => ({
  flexDirection: value || 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

export const absoluteFill = () => ({
  ...StyleSheet.absoluteFillObject,
});
