import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

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
    [prop: string]: string | number | boolean | object;
    // css: {
    //   color: 'blueviolet';
    //   borderColor: 'darkviolet';
    // };
  }>;
  defaultVariants?: {
    [prop: string]: string;
  };
} & StyleProperties<T>;

export type ThemeToken = {
  [name: string]: string | number;
};

export type Theme = {
  colors: ThemeToken;
  space: ThemeToken;
  fontSizes: ThemeToken;
  fonts: ThemeToken;
  fontWeights: ThemeToken;
  lineHeights: ThemeToken;
  letterSpacings: ThemeToken;
  sizes: ThemeToken;
  borderWidths: ThemeToken;
  borderStyles: ThemeToken;
  radii: ThemeToken;
  shadows: ThemeToken;
  zIndices: ThemeToken;
  transitions: ThemeToken;
};
