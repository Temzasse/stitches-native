import { styled } from '../styles';

export const Media = styled('Text', {
  color: '$text',
  '@xxl': {
    fontSize: 64,
  },
  '@xl': {
    fontSize: 48,
  },
  '@lg': {
    fontSize: 32,
  },
  '@md': {
    fontSize: 24,
  },
  '@sm': {
    fontSize: 12,
  },
  marginTopRem: 1,
  marginBottomRem: 1,
  variants: {
    color: {
      primary: { color: 'red' },
      secondary: { color: 'blue' },
      third: { color: 'purple' },
      forth: { color: 'green' },
      fifth: { color: 'black' },
    },
  },
});
