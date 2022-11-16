import { TextProps as RNTextProps } from 'react-native';
import { styled, css } from '../styles';

export const Typography = styled('Text', {
  color: '$text',
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
      },
    },
    {
      heading: 'h4',
      underlined: true,
      css: {
        borderBottomColor: 'red',
      },
    },
    {
      heading: 'h3',
      underlined: true,
      css: {
        borderBottomColor: 'blue',
      },
    },
    {
      heading: 'h2',
      underlined: true,
      css: {
        borderBottomColor: 'green',
      },
    },
    {
      heading: 'h1',
      underlined: true,
      css: {
        borderBottomColor: 'purple',
      },
    },
    {
      // NOTE: To check default variants
      heading: 'h1',
      underlined: false,
      css: {
        marginBottom: 2,
      },
    },
  ],
});

export const Heading = styled(
  'Text',
  {
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
      underlined: {
        true: {
          paddingRight: 4,
          paddingLeft: 4,
          borderBottomWidth: 1,
        },
      },
    },
    defaultVariants: {
      heading: 'h1',
      underlined: false,
    },
  },
  // TODO: fix this! Native `Text` cannot have a border bottom!
  // The example needs to wrap the text with a `View` and apply the border bottom to that.
  underLinedStyle
).attrs(() => ({
  accessibilityRole: 'text',
}));
