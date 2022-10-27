import { styled, themeProp } from '../styles';

export const Media = styled('Text', {
  color: '$text',
  '@lg': {
    fontSize: 16,
  },
  '@md': {
    fontSize: 14,
  },
  '@sm': {
    fontSize: 12,
  },
  variants: {
    ...themeProp('color', 'colors', (value) => ({
      color: value,
    })),
    variant: {
      body: { typography: '$body' },
      bodySmall: { typography: '$bodySmall' },
      bodyExtraSmall: { typography: '$bodyExtraSmall' },
      title1: { typography: '$title1' },
      title2: { typography: '$title2' },
      title3: { typography: '$title3' },
    },
    align: {
      left: { textAlign: 'left' },
      right: { textAlign: 'right' },
      center: { textAlign: 'center' },
    },
  },
  defaultVariants: {
    variant: 'body',
  },
});
