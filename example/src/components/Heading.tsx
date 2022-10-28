import { TextProps as RNTextProps } from 'react-native';
import { styled } from '../styles';

export const Typography = styled('Text', {
  color: '$plainText',
  fontSizeRem: 1,
});

type HeadingSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

export type HeadingProps = RNTextProps & {
  heading?: HeadingSize;
};

export const Heading = styled('Text', {
  fontWeight: 'bold',
  color: '$plainText',
  variants: {
    heading: {
      h5: { fontSizeRem: 1.0, color: 'black' },
      h4: { fontSizeRem: 1.1, color: 'red' },
      h3: { fontSizeRem: 1.25, color: 'blue' },
      h2: { fontSizeRem: 1.5, color: 'green' },
      h1: { fontSizeRem: 2.5, color: 'purple' },
    },
  },
  defaultVariants: {
    heading: 'h1',
  },
}).attrs(() => ({
  accessibilityRole: 'text',
}));
