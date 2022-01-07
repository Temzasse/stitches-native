import { styled, themeProp } from '../styles';

export const Spacer = styled('View', {
  flexShrink: 0,
  variants: {
    ...themeProp('size', 'space', (value) => ({
      width: `$space${value}`,
      height: `$space${value}`,
    })),
    axis: {
      x: { height: 'auto' },
      y: { width: 'auto' },
    },
    debug: {
      true: { backgroundColor: 'red' },
      false: { backgroundColor: 'transparent' },
    },
  },
});

// @ts-ignore
Spacer.__SPACER__ = true; // This is used to detect spacers inside Stack component
