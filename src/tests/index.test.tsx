import React from 'react';
import { render } from '@testing-library/react-native';
import { createStitches as _createStitches } from '../internals';
import type { CreateStitches } from '../types';

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
