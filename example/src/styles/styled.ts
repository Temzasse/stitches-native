import { StyleSheet } from 'react-native';
import { getDeviceTypeAsync, DeviceType } from 'expo-device';
import { createStitches } from 'stitches-native';
import type * as Stitches from 'stitches-native';

import { size, shadow, typography, flexCenter, absoluteFill } from './utils';

const media = {
  // You can provide boolean values for breakpoints when you just need to
  // distinguish between phone and tablet devices
  phone: true,
  tablet: false,

  // If you are not using Expo you should use react-native-device-info
  // to get the device type synchronously
  /*
  phone: true, // !DeviceInfo.isTablet()
  tablet: false, // DeviceInfo.isTablet()
  */

  // You can also define min width based media queries that overlap each other
  // which is a commonly used technique in web development
  // NOTE: make sure the keys are ordered from smallest to largest screen size!
  md: '(width >= 750px)',
  lg: '(width >= 1080px)',
  xl: '(width >= 1284px)',
  xxl: '(width >= 1536px)',

  // It's also possible to specify ranges that don't overlap if you want to be
  // very precise with your media queries and don't prefer the min width based approach
  /*
  sm: '(width <= 750px)', // Small phone, eg. iPhone SE
  md: '(750px < width <= 1080px)', // Regular phone, eg. iPhone 6/7/8 Plus
  lg: '(1080px < width <= 1284px)', // Large phone, eg. iPhone 12 Pro Max
  xl: '(1284px < width <= 1536px)', // Regular tablet, eg. iPad Pro 9.7
  xxl: '(width > 1536px)', // Large tablet
  */
};

// This is a bit hacky but Expo doesn't have a sync way to get the device type
getDeviceTypeAsync().then((deviceType) => {
  media.phone = deviceType === DeviceType.PHONE;
  media.tablet = deviceType === DeviceType.TABLET;
});

const { styled, css, createTheme, config, theme, useTheme, ThemeProvider } =
  createStitches({
    theme: {
      colors: {
        // Main palette (these should not be used directly but via aliases instead)
        blue100: '#ab9cf7',
        blue500: '#301b96',
        blue900: '#0D0630',
        green100: '#d9fff6',
        green500: '#8BBEB2',
        green900: '#384d48',
        black: '#000000',
        white: '#ffffff',
        gray50: '#f2f2f7',
        gray100: '#e5e5ea',
        gray200: '#d1d1d6',
        gray300: '#c7c7cc',
        gray400: '#aeaeb2',
        gray500: '#8e8e93',
        gray600: '#636366',
        gray700: '#48484a',
        gray800: '#3a3a3c',
        gray850: '#2c2c2e',
        gray900: '#1d1d1f',

        // Brand colors
        primary: '$blue500',
        primaryText: '$blue900',
        primaryMuted: '$blue100',
        secondary: '$green500',
        secondaryText: '$green900',
        secondaryMuted: '$green100',

        // Informative colors
        info: '#3B82F6',
        infoText: '#0A45A6',
        infoMuted: '#cfdef7',
        success: '#10B981',
        successText: '#06734E',
        successMuted: '#cee8df',
        warn: '#FBBF24',
        warnText: '#8a6200',
        warnMuted: '#f3ead1',
        error: '#EF4444',
        errorText: '#8C0606',
        errorMuted: '#f3d2d3',

        // General colors
        text: '$black',
        textInverted: '$white',
        border: 'rgba(150, 150, 150, 0.3)',
        backdrop: 'rgba(0,0,0,0.5)',
        background: '$white',
        surface: '$white',
        elevated: '$white',
        muted1: '$gray500',
        muted2: '$gray400',
        muted3: '$gray300',
        muted4: '$gray200',
        muted5: '$gray100',
        muted6: '$gray50',
      },
      fontWeights: {
        bold: '700',
        semibold: '500',
        normal: '400',
      },
      borderStyles: {
        solid: 'solid',
      },
      borderWidths: {
        thin: StyleSheet.hairlineWidth,
        normal: 1,
        thick: 2,
      },
      fontSizes: {
        xxs: 10,
        xs: 14,
        sm: 16,
        md: 18,
        lg: 20,
        xl: 24,
        xxl: 32,
      },
      lineHeights: {
        xxs: 12,
        xs: 16,
        sm: 18,
        md: 20,
        lg: 24,
        xl: 28,
        xxl: 36,
      },
      letterSpacings: {
        tight: 0.1,
        sparse: 1,
      },
      zIndices: {
        modal: 1000,
      },
      space: {
        none: 0,
        1: 4,
        2: 8,
        3: 16,
        4: 24,
        5: 32,
        6: 40,
        7: 56,
        8: 72,
        9: 96,
        max: '$9' as const,
      },
      sizes: {
        hairlineWidth: StyleSheet.hairlineWidth,
      },
      radii: {
        sm: 4,
        md: 8,
        lg: 24,
        full: 999,
      },
    },
    utils: {
      size,
      shadow,
      typography,
      flexCenter,
      absoluteFill,
    },
    media,
  });

const darkTheme = createTheme({
  colors: {
    // Brand colors
    primary: '$blue500',
    primaryText: '$blue100',
    primaryMuted: '$blue900',
    secondary: '$green500',
    secondaryText: '$green100',
    secondaryMuted: '$green900',

    // Informative colors
    info: '#3B82F6',
    infoText: '#81aef7',
    infoMuted: '#1b2940',
    success: '#10B981',
    successText: '#1ee8a5',
    successMuted: '#193328',
    warn: '#FBBF24',
    warnText: '#ffc93d',
    warnMuted: '#40351a',
    error: '#EF4444',
    errorText: '#ff7070',
    errorMuted: '#3e1c1d',

    // General colors
    text: '$white',
    textInverted: '$black',
    background: '$black',
    backdrop: 'rgba(0,0,0,0.5)',
    surface: '$gray800',
    elevated: '$gray600',
    muted1: '$gray500',
    muted2: '$gray600',
    muted3: '$gray700',
    muted4: '$gray800',
    muted5: '$gray850',
    muted6: '$gray900',
  },
});

export {
  styled,
  css,
  createTheme,
  useTheme,
  config,
  theme,
  darkTheme,
  ThemeProvider,
};

export type CSS = Stitches.CSS<typeof config>;
export type Theme = typeof theme;
