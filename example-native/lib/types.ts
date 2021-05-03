import React from 'react';
import {
  ViewStyle,
  TextStyle,
  ImageStyle,
  ButtonProps,
  FlatListProps,
  ImageProps,
  ImageBackgroundProps,
  InputAccessoryViewProps,
  KeyboardAvoidingViewProps,
  PressableProps,
  ScrollViewProps,
  SectionListProps,
  TextProps,
  TextInputProps,
  TouchableHighlightProps,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
  TouchableWithoutFeedbackProps,
  ViewProps,
  VirtualizedListProps
} from 'react-native';

export type StyledComponent =
  | 'Button'
  | 'FlatList'
  | 'Image'
  | 'ImageBackground'
  | 'InputAccessoryView'
  | 'KeyboardAvoidingView'
  | 'Pressable'
  | 'SafeAreaView'
  | 'ScrollView'
  | 'SectionList'
  | 'Text'
  | 'TextInput'
  | 'TouchableHighlight'
  | 'TouchableNativeFeedback'
  | 'TouchableOpacity'
  | 'TouchableWithoutFeedback'
  | 'View'
  | 'VirtualizedList';

export type PolymorphicProps<T extends StyledComponent> = T extends 'Button'
  ? ButtonProps
  : T extends 'FlatList'
  ? FlatListProps<any>
  : T extends 'Image'
  ? ImageProps
  : T extends 'ImageBackground'
  ? ImageBackgroundProps
  : T extends 'InputAccessoryView'
  ? InputAccessoryViewProps
  : T extends 'KeyboardAvoidingView'
  ? KeyboardAvoidingViewProps
  : T extends 'Pressable'
  ? PressableProps
  : T extends 'ScrollView'
  ? ScrollViewProps
  : T extends 'SectionList'
  ? SectionListProps<any>
  : T extends 'Text'
  ? TextProps
  : T extends 'TextInput'
  ? TextInputProps
  : T extends 'TouchableHighlight'
  ? TouchableHighlightProps
  : T extends 'TouchableNativeFeedback'
  ? TouchableNativeFeedbackProps
  : T extends 'TouchableOpacity'
  ? TouchableOpacityProps
  : T extends 'TouchableWithoutFeedback'
  ? TouchableWithoutFeedbackProps
  : T extends 'VirtualizedList'
  ? VirtualizedListProps<any>
  : ViewProps;

export type StyleProperties<T extends StyledComponent> = T extends 'Text'
  ? TextStyle
  : T extends 'Image'
  ? ImageStyle
  : ViewStyle;

export type AllStyleProperties = ViewStyle & ImageStyle & TextStyle;

export type AnyStyleProperties = ViewStyle | ImageStyle | TextStyle;

export type StyledConfig<T extends StyledComponent> = {
  variants?: {
    [prop: string]: {
      [variant: string]: StyleProperties<T>;
    };
  };
  compoundVariants?: Array<{
    [prop: string]: string | number | boolean | object; // TOOD: fix type
    // css: object;
  }>;
  defaultVariants?: {
    [prop: string]: string;
  };
} & StyleProperties<T>;

export type ComponentProps<
  T extends StyledComponent,
  V extends StyledConfig<any>['variants']
> = PolymorphicProps<T> & {
  css?: any;
  children?: React.ReactNode; // TODO: improve children handling
} & {
    [K in keyof V]?: ComponentPropValue<keyof V[K]>;
  };

export type ComponentPropValue<T> = T extends 'true'
  ? boolean
  : T extends 'false'
  ? boolean
  : T;

export type ThemeToken = {
  [name: string]: string | number;
};

export type Theme = {
  colors?: ThemeToken;
  space?: ThemeToken;
  fontSizes?: ThemeToken;
  fonts?: ThemeToken;
  fontWeights?: ThemeToken;
  lineHeights?: ThemeToken;
  letterSpacings?: ThemeToken;
  sizes?: ThemeToken;
  borderWidths?: ThemeToken;
  borderStyles?: ThemeToken;
  radii?: ThemeToken;
  shadows?: ThemeToken;
  zIndices?: ThemeToken;
  transitions?: ThemeToken;
};

export type Config = {
  theme?: Theme;
  media?: any;
  utils?: any;
  themeMap?: any;
};
