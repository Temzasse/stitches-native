import React from 'react';
import { render } from '@testing-library/react-native';

import {
  flattenCompoundVariantStyles,
  flattenStyles,
  flattenVariantStyles,
} from '../internals/utils';

import { createStitches as _createStitches } from '../internals';
import { CreateStitches } from '../types';
import { mockDimensions } from './utils';

// NOTE: the JSDoc types from the internal `createStitches` are not working properly
const createStitches = _createStitches as CreateStitches;

describe('Basic', () => {
  it('Functionality of styled()', () => {
    const { styled } = createStitches();

    const Comp = styled('View', {
      backgroundColor: 'red',
      height: 100,
      width: 100,
    });

    const { toJSON } = render(<Comp />);
    const result = toJSON();

    expect(result?.type).toEqual('View');
    expect(result?.props.style[0]).toMatchObject({
      backgroundColor: 'red',
      height: 100,
      width: 100,
    });
  });

  it('Functionality of styled() should not trigger recompute when a runtime theme is not used', () => {
    const { styled, createTheme } = createStitches({
      theme: {
        sizes: { demoWidth: 100 },
      },
    });

    const Comp = styled('View', {
      backgroundColor: 'red',
      height: 100,
      width: '$demoWidth',
    });

    render(<Comp />);

    createTheme({ sizes: { demoWidth: 10 } });

    const { toJSON } = render(<Comp />);

    const result = toJSON();

    expect(result?.type).toEqual('View');
    expect(result?.props.style[0]).toMatchObject({
      backgroundColor: 'red',
      height: 100,
      width: 100,
    });
  });
});

describe('Runtime', () => {
  it('Functionality of ThemeProvider', () => {
    const { styled, createTheme, ThemeProvider } = createStitches({
      theme: {
        sizes: { demoWidth: 100 },
      },
    });

    const Comp = styled('View', {
      backgroundColor: 'red',
      height: 100,
      width: '$demoWidth',
    });

    const newTheme = createTheme({ sizes: { demoWidth: 30 } });

    const { toJSON } = render(
      <ThemeProvider theme={newTheme}>
        <Comp />
      </ThemeProvider>
    );

    const result = toJSON();

    expect(result?.type).toEqual('View');
    expect(result?.props.style[0]).toMatchObject({
      backgroundColor: 'red',
      height: 100,
      width: 30,
    });
  });

  it('Functionality of ThemeProvider should use new theme when a runtime theme is added', () => {
    const { styled, createTheme, ThemeProvider } = createStitches({
      theme: {
        sizes: { demoWidth: 100 },
      },
    });

    const Comp = styled('View', {
      backgroundColor: 'red',
      height: 100,
      width: '$demoWidth',
    });

    const newTheme = createTheme({ sizes: { demoWidth: 10 } });

    const { toJSON } = render(
      <ThemeProvider theme={newTheme}>
        <Comp />
      </ThemeProvider>
    );

    const result = toJSON();

    expect(result?.type).toEqual('View');
    expect(result?.props.style[0]).toMatchObject({
      backgroundColor: 'red',
      height: 100,
      width: 10,
    });
  });

  it('Functionality of ThemeProvider should trigger recompute when a runtime theme is added', () => {
    const { styled, createTheme, ThemeProvider } = createStitches({
      theme: {
        sizes: { demoWidth: 100 },
      },
    });

    const Comp = styled('View', {
      backgroundColor: 'red',
      height: 100,
      width: '$demoWidth',
    });

    render(<Comp />);

    const newTheme = createTheme({ sizes: { demoWidth: 10 } });

    const { toJSON } = render(
      <ThemeProvider theme={newTheme}>
        <Comp />
      </ThemeProvider>
    );

    const result = toJSON();

    expect(result?.type).toEqual('View');
    expect(result?.props.style[0]).toMatchObject({
      backgroundColor: 'red',
      height: 100,
      width: 10,
    });
  });
});

describe('Media', () => {
  it('Nested utils and media queries with theme values', async () => {
    const { styled } = createStitches({
      media: {
        bp1: '(width <= 640px)',
        bp2: '(width <= 1024px)',
      },
      utils: {
        util1: (value: number) => ({
          fontSize: value,
          '@bp1': { fontSize: value / 2 },
          '@bp2': { fontSize: value * 2 },
        }),
        util2: (value: number) => ({
          util1: 20,
          width: value,
          height: value,
          '@bp1': { width: value / 2, height: value / 2 },
          '@bp2': { width: value * 2, height: value * 2 },
        }),
      },
    });

    const Comp = styled('View', {
      backgroundColor: 'yellow',
      color: 'red',
      util2: 100,
      '@bp1': {
        color: 'blue',
      },
    });

    mockDimensions({ width: 640 });

    const { toJSON } = render(<Comp />);
    const result = toJSON();

    expect(result?.props.style[0]).toMatchObject({
      backgroundColor: 'yellow',
      // Styles from @bp1
      color: 'blue', // <- base media query
      fontSize: 10, // <- util1
      width: 50, // <- util2
      height: 50, // <- util2
    });
  });
});

describe('Utils', () => {
  const utils = {
    util1: (value) => ({
      fontSize: value,
      '@bp1': { fontSize: value / 2 },
      '@bp2': { fontSize: value * 2 },
    }),
    util2: (value) => ({
      util1: 20,
      width: value,
      height: value,
      '@bp2': { width: value * 3, height: value * 3 },
    }),
  };

  it('flattenStyles', () => {
    const result = flattenStyles(
      {
        color: 'red',
        util2: 100,
        '@bp1': { color: 'blue' },
      },
      utils
    );

    expect(result).toMatchObject({
      color: 'red',
      fontSize: 20,
      width: 100,
      height: 100,
      bp1: { color: 'blue', fontSize: 10 },
      bp2: { fontSize: 40, width: 300, height: 300 },
    });
  });

  it('flattenVariantStyles', () => {
    const result = flattenVariantStyles(
      {
        v1: {
          x: { util1: 10 },
          y: { util2: 100 },
        },
      },
      utils
    );

    expect(result).toMatchObject({
      v1: {
        x: {
          fontSize: 10,
          bp1: { fontSize: 5 },
          bp2: { fontSize: 20 },
        },
        y: {
          width: 100,
          height: 100,
          fontSize: 20,
          bp1: { fontSize: 10 },
          bp2: { fontSize: 40, width: 300, height: 300 },
        },
      },
    });
  });

  it('flattenCompoundVariantStyles', () => {
    const result = flattenCompoundVariantStyles(
      [
        {
          v1: 'x',
          v2: 'y',
          css: { util2: 100, '@bp1': { color: 'blue' } },
        },
      ],
      utils
    );

    expect(result).toMatchObject([
      {
        v1: 'x',
        v2: 'y',
        css: {
          width: 100,
          height: 100,
          fontSize: 20,
          bp1: { color: 'blue', fontSize: 10 },
          bp2: { fontSize: 40, width: 300, height: 300 },
        },
      },
    ]);
  });
});
