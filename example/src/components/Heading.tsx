import { TextProps as RNTextProps } from 'react-native';
import { styled, css } from '../styles';

export const Typography = styled('Text', {
  color: '$plainText',
  fontSizeRem: 1,
});

type HeadingSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';

export type HeadingProps = RNTextProps & {
  heading?: HeadingSize;
};

const underLinedStyle = css({
  compoundVariants: [
    {
      heading: 'h5',
      underlined: true,
      css: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
      },
    },
    {
      heading: 'h4',
      underlined: true,
      css: {
        borderBottomColor: 'red',
        borderBottomWidth: 1,
      },
    },
    {
      heading: 'h3',
      underlined: true,
      css: {
        borderBottomColor: 'blue',
        borderBottomWidth: 1,
      },
    },
    {
      heading: 'h2',
      underlined: true,
      css: {
        borderBottomColor: 'green',
        borderBottomWidth: 1,
      },
    },
    {
      heading: 'h1',
      underlined: true,
      css: {
        borderBottomColor: 'purple',
        borderBottomWidth: 1,
      },
    },
    {
      // NOTE: To check default variants
      heading: 'h1',
      underlined: false,
      css: {
        marginBottom: '2px',
      },
    },
  ],
});

export const Heading = styled(
  'Text',
  {
    fontWeight: 'bold',
    color: '$plainText',
    width: 'fit-content',
    variants: {
      heading: {
        h5: { fontSizeRem: 1.0, color: 'black' },
        h4: { fontSizeRem: 1.1, color: 'red' },
        h3: { fontSizeRem: 1.25, color: 'blue' },
        h2: { fontSizeRem: 1.5, color: 'green' },
        h1: { fontSizeRem: 2.5, color: 'purple' },
      },
      underlined: {
        true: {
          paddingRight: '4px',
          paddingLeft: '4px',
        },
      },
    },
    defaultVariants: {
      heading: 'h1',
      underlined: false,
    },
  },
  underLinedStyle
).attrs(() => ({
  accessibilityRole: 'text',
}));
