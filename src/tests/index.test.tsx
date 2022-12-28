import React from 'react';
import { render } from '@testing-library/react-native';

import {
  flattenStyles,
  flattenVariantStyles,
  flattenCompoundVariantStyles,
} from '../internals/utils';

import { resolveMediaRangeQueries } from '../internals/media';
import { createStyleSheet, processStyleSheet } from '../internals/styles';
import { createStitches as _createStitches } from '../internals';
import { CreateStitches } from '../types';
import { mockDimensions, reduceStyles } from './utils';

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

  it('Combination of all features', () => {
    mockDimensions({ width: 1080 });

    const { styled } = createStitches({
      theme: {
        colors: {
          primary: 'red',
          secondary: 'blue',
          tertiary: 'yellow',
        },
        radii: {
          sm: 5,
          md: 10,
          lg: 15,
        },
      },
      media: {
        md: '(width >= 750px)',
        lg: '(width >= 1080px)',
        xl: '(width >= 1284px)',
        xxl: '(width >= 1536px)',
      },
    });

    const Comp = styled('View', {
      height: 100,
      width: 100,
      variants: {
        v1: {
          one: {
            backgroundColor: '$primary',
            '@lg': { backgroundColor: 'black' },
          },
          two: {
            backgroundColor: '$secondary',
          },
          three: {
            backgroundColor: '$tertiary',
          },
        },
        v2: {
          one: { borderColor: '$primary' },
          two: { borderColor: '$secondary' },
          three: { borderColor: '$tertiary' },
        },
      },
      compoundVariants: [
        {
          v1: 'one',
          v2: 'two',
          css: {
            borderRadius: '$sm',
            borderWidth: 1,
            '@md': { color: 'red' },
          },
        },
        {
          v1: 'two',
          v2: 'three',
          css: {
            borderRadius: '$lg',
            borderWidth: 2,
          },
        },
      ],
      defaultVariants: {
        v1: 'one',
        v2: 'one',
      },
    });

    const { toJSON } = render(<Comp v1="one" v2="two" />);
    const result = toJSON();

    expect(result?.type).toEqual('View');
    expect(reduceStyles(result?.props.style)).toMatchObject({
      height: 100,
      width: 100,
      backgroundColor: 'black',
      borderColor: 'blue',
      borderRadius: 5,
      borderWidth: 1,
    });
  });
});

describe('Media', () => {
  it('Nested utils and media queries with theme values', async () => {
    const { styled } = createStitches({
      media: {
        md: '(width >= 750px)',
        lg: '(width >= 1080px)',
        xl: '(width >= 1284px)',
        xxl: '(width >= 1536px)',
      },
      utils: {
        util1: (value: number) => ({
          fontSize: value,
          '@md': { fontSize: value / 2 },
          '@lg': { fontSize: value * 2 },
        }),
        util2: (value: number) => ({
          util1: 20,
          width: value,
          height: value,
          '@md': { width: value / 2, height: value / 2 },
          '@lg': { width: value * 2, height: value * 2 },
        }),
      },
    });

    const Comp = styled('View', {
      backgroundColor: 'yellow',
      color: 'red',
      util2: 100,
      '@md': {
        color: 'blue',
      },
    });

    mockDimensions({ width: 640 });

    const result1 = render(<Comp />).toJSON();

    expect(reduceStyles(result1?.props.style)).toMatchObject({
      backgroundColor: 'yellow',
      color: 'red',
      width: 100,
      height: 100,
      fontSize: 20,
    });

    mockDimensions({ width: 750 });

    const result2 = render(<Comp />).toJSON();

    expect(reduceStyles(result2?.props.style)).toMatchObject({
      backgroundColor: 'yellow',
      // Styles from @md
      color: 'blue', // <- base media query
      fontSize: 10, // <- util1
      width: 50, // <- util2
      height: 50, // <- util2
    });

    mockDimensions({ width: 1080 });

    const result3 = render(<Comp />).toJSON();

    expect(reduceStyles(result3?.props.style)).toMatchObject({
      backgroundColor: 'yellow',
      // Styles from @lg
      color: 'blue', // <- base media query (applied also fo lg due to min width based media query)
      fontSize: 40, // <- util1
      width: 200, // <- util2
      height: 200, // <- util2
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

  it('resolveMediaRangeQueries', () => {
    const media = {
      bp1: '(width >= 640px)',
      bp2: '(width >= 1024px)',
      bp3: '(320px <= width < 1280px)',
      phone: true,
      tablet: false,
    };

    const result1 = resolveMediaRangeQueries(media, 640);
    expect(result1).toMatchObject(['bp1', 'bp3', 'phone']);

    media.phone = false;
    media.tablet = true;

    const result2 = resolveMediaRangeQueries(media, 1024);
    expect(result2).toMatchObject(['bp1', 'bp2', 'bp3', 'tablet']);

    const result3 = resolveMediaRangeQueries({}, 640);
    expect(result3).toMatchObject([]);

    const result4 = resolveMediaRangeQueries(
      { bp1: false, bp2: false, bp3: true },
      640
    );
    expect(result4).toMatchObject(['bp3']);
  });

  it('createStyleSheet', () => {
    const theme = {
      colors: {
        primary: 'red',
        secondary: 'blue',
        tertiary: 'yellow',
      },
      radii: {
        sm: 5,
        md: 10,
        lg: 15,
      },
    };

    const result = createStyleSheet({
      theme,
      themeMap: undefined,
      styles: { height: 100, width: 100, sm: { height: 50, width: 50 } },
      variants: {
        v1: {
          one: {
            backgroundColor: '$primary',
            sm: { backgroundColor: 'white' },
            md: { backgroundColor: 'black' },
            lg: { backgroundColor: 'pink' },
          },
          two: { backgroundColor: '$secondary' },
          three: { backgroundColor: '$tertiary' },
        },
        v2: {
          one: { borderColor: '$primary' },
          two: { borderColor: '$secondary' },
          three: { borderColor: '$tertiary' },
        },
      },
      compoundVariants: [
        {
          v1: 'one',
          v2: 'three',
          css: { borderRadius: '$sm', borderWidth: 1 },
        },
        {
          v1: 'two',
          v2: 'four',
          css: { borderRadius: '$lg', borderWidth: 2 },
        },
      ],
    });

    expect(result).toEqual({
      base: { height: 100, width: 100, sm: { height: 50, width: 50 } },
      v1_one: {
        backgroundColor: 'red',
        sm: { backgroundColor: 'white' },
        md: { backgroundColor: 'black' },
        lg: { backgroundColor: 'pink' },
      },
      v1_two: { backgroundColor: 'blue' },
      v1_three: { backgroundColor: 'yellow' },
      v2_one: { borderColor: 'red' },
      v2_two: { borderColor: 'blue' },
      v2_three: { borderColor: 'yellow' },
      'v1_one+v2_three': { borderRadius: 5, borderWidth: 1 },
      'v1_two+v2_four': { borderRadius: 15, borderWidth: 2 },
    });
  });

  it('processStyleSheet', () => {
    const styleSheet = {
      base: {
        height: 100,
        width: 100,
        sm: { height: 50, width: 50 },
      },
      v1_one: {
        backgroundColor: 'red',
        sm: { backgroundColor: 'orange' },
        md: { backgroundColor: 'black' },
      },
      v1_two: {
        backgroundColor: 'blue',
        lg: { backgroundColor: 'white' },
      },
      v1_three: {
        backgroundColor: 'yellow',
      },
    };

    const media = {
      sm: '(width >= 600px)',
      md: '(width >= 750px)',
      lg: '(width >= 1080px)',
    };

    const result1 = processStyleSheet(styleSheet, media, ['md', 'lg']);

    expect(result1).toEqual({
      base: { height: 100, width: 100 },
      v1_one: { backgroundColor: 'black' },
      v1_two: { backgroundColor: 'white' },
      v1_three: { backgroundColor: 'yellow' },
    });

    const result2 = processStyleSheet(styleSheet, media, ['sm']);

    expect(result2).toEqual({
      base: { height: 50, width: 50 },
      v1_one: { backgroundColor: 'orange' },
      v1_two: { backgroundColor: 'blue' },
      v1_three: { backgroundColor: 'yellow' },
    });
  });
});
