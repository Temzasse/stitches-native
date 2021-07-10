import { StyleSheet } from 'react-native';
import { createCss } from './lib';

const { styled, css, theme, ThemeProvider } = createCss({
  theme: {
    colors: {
      primary: '#301b96',
      primaryDark: '#0D0630',
      primaryLight: '#ab9cf7',
      secondary: '#8BBEB2',
      secondaryDark: '#384d48',
      secondaryLight: '#d9fff6',
      background: '#fff',
    },
    space: {
      1: 4,
      2: 8,
      3: 16,
      4: 24,
      5: 32,
      6: 40,
      7: 56,
      8: 72,
      9: 96,
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
    size: () => (value: number) => ({
      width: value,
      height: value,
    }),
    flexCenter: () => (value: 'row' | 'column' = 'row') => ({
      flexDirection: value,
      justifyContent: 'center',
      alignItems: 'center',
    }),
    absoluteFill: () => () => ({
      ...StyleSheet.absoluteFillObject,
    }),
  },
  media: {
    // You can provide boolean values for breakpoints when you just need to
    // distinguish between phone and tablet devices
    phone: true, // Eg. !DeviceInfo.isTablet()
    tablet: false, // Eg. DeviceInfo.isTablet()

    // You can also define min width based media queries that overlap each other
    // which is a commonly used technique in web development
    // NOTE: make sure the keys are ordered from smallest to largest screen size!
    md: '(width >= 750px)',
    lg: '(width >= 1080px)',
    xl: '(width >= 1284px)',
    xxl: '(width >= 1536px)',

    // It's also possible to specify ranges that don't overlap if you want to be
    // very precise with your media queries and don't prefer the min width based approach
    // sm: '(width <= 750px)', // Small phone, eg. iPhone SE
    // md: '(750px < width <= 1080px)', // Regular phone, eg. iPhone 6/7/8 Plus
    // lg: '(1080px < width <= 1284px)', // Large phone, eg. iPhone 12 Pro Max
    // xl: '(1284px < width <= 1536px)', // Regular tablet, eg. iPad Pro 9.7
    // xxl: '(width > 1536px)', // Large tablet
  },
});

const darkTheme = theme({
  colors: {
    background: '#222',
  },
});

export { styled, css, theme, darkTheme, ThemeProvider };
