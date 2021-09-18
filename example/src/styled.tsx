import { getDeviceTypeAsync, DeviceType } from 'expo-device';
import { StyleSheet } from 'react-native';
import { createStitches } from 'stitches-native';
import type * as Stitches from 'stitches-native';

const media = {
  phone: true,
  tablet: false,
  md: '(width >= 750px)',
  lg: '(width >= 1080px)',
  xl: '(width >= 1284px)',
  xxl: '(width >= 1536px)',
};

// This is a bit hacky but Expo doesn't have a sync way to get the device type
getDeviceTypeAsync().then((deviceType) => {
  media.phone = deviceType === DeviceType.PHONE;
  media.tablet = deviceType === DeviceType.TABLET;
});

const { styled, css, theme, createTheme, useTheme, ThemeProvider, config } =
  createStitches({
    theme: {
      colors: {
        // Palette
        blue100: '#ab9cf7',
        blue500: '#301b96',
        blue900: '#0D0630',
        black: '#222',
        white: '#fff',

        primary: '$blue500',
        primaryDark: '$blue900',
        primaryLight: '$blue100',
        secondary: '#8BBEB2',
        secondaryDark: '#384d48',
        secondaryLight: '#d9fff6',
        background: '$white',
        text: '$black',
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
      size: (value: Stitches.PropertyValue<'width'>) => ({
        width: value,
        height: value,
      }),
      shadow: (level: 'small' | 'medium' | 'large') => {
        return {
          small: {
            elevation: 2,
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 3,
            shadowOpacity: 0.1,
            shadowColor: '#000',
          },
          medium: {
            elevation: 5,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 6,
            shadowOpacity: 0.2,
            shadowColor: '#000',
          },
          large: {
            elevation: 10,
            shadowOffset: { width: 0, height: 6 },
            shadowRadius: 12,
            shadowOpacity: 0.4,
            shadowColor: '#000',
          },
        }[level];
      },
      flexCenter: (value?: Stitches.PropertyValue<'flexDirection'>) => ({
        flexDirection: value || 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }),
      absoluteFill: () => ({
        ...StyleSheet.absoluteFillObject,
      }),
      equalPaddingMargin: (value: Stitches.PropertyValue<'padding'>) => ({
        padding: value,
        margin: value,
      }),
    },
    media,
    // media: {
    //   // You can provide boolean values for breakpoints when you just need to
    //   // distinguish between phone and tablet devices
    //   phone: true, // Eg. !DeviceInfo.isTablet()
    //   tablet: false, // Eg. DeviceInfo.isTablet()

    //   // You can also define min width based media queries that overlap each other
    //   // which is a commonly used technique in web development
    //   // NOTE: make sure the keys are ordered from smallest to largest screen size!
    //   md: '(width >= 750px)',
    //   lg: '(width >= 1080px)',
    //   xl: '(width >= 1284px)',
    //   xxl: '(width >= 1536px)',

    //   // It's also possible to specify ranges that don't overlap if you want to be
    //   // very precise with your media queries and don't prefer the min width based approach
    //   // sm: '(width <= 750px)', // Small phone, eg. iPhone SE
    //   // md: '(750px < width <= 1080px)', // Regular phone, eg. iPhone 6/7/8 Plus
    //   // lg: '(1080px < width <= 1284px)', // Large phone, eg. iPhone 12 Pro Max
    //   // xl: '(1284px < width <= 1536px)', // Regular tablet, eg. iPad Pro 9.7
    //   // xxl: '(width > 1536px)', // Large tablet
    // },
  });

const darkTheme = createTheme({
  colors: {
    background: '$black',
    text: '$white',
  },
});

console.log('> theme | createStitches', theme);
console.log('> darkTheme | createTheme', darkTheme);

export type CSS = Stitches.CSS<typeof config>;

export { styled, css, createTheme, darkTheme, theme, useTheme, ThemeProvider };
