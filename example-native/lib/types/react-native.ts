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
  VirtualizedListProps,
} from 'react-native';

export type AllStyleProperty = ViewStyle & ImageStyle & TextStyle;
export type AnyStyleProperty = ViewStyle | ImageStyle | TextStyle;

export type StyleProperty<T extends StyledPrimitive> = T extends 'Text'
  ? TextStyle
  : T extends 'Image'
  ? ImageStyle
  : ViewStyle;

export type BorderStyle = 'solid' | 'dotted' | 'dashed';

export type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900';

export type NumberProperty =
  | 'aspectRatio'
  | 'elevation'
  | 'end'
  | 'flex'
  | 'flexGrow'
  | 'flexShrink'
  | 'opacity'
  | 'shadowOpacity'
  | 'shadowRadius'
  | 'textShadowRadius';

export type StringProperty =
  | 'fontStyle'
  | 'shadowColor'
  | 'textShadowColor'
  | 'textDecorationColor';

export type BooleanProperty = 'includeFontPadding';

export type StrictStyleProperty<T extends string> = T extends 'alignContent'
  ? 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around' // prettier-ignore
  : T extends 'alignItems'
  ? 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  : T extends 'alignSelf'
  ? 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'
  : T extends 'flexDirection'
  ? 'row' | 'row-reverse' | 'column' | 'column-reverse'
  : T extends 'flexWrap'
  ? 'wrap' | 'nowrap' | 'wrap-reverse'
  : T extends 'justifyContent'
  ? 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' // prettier-ignore
  : T extends 'direction'
  ? 'inherit' | 'ltr' | 'rtl'
  : T extends 'display'
  ? 'auto' | 'flex'
  : T extends 'overflow'
  ? 'visible' | 'hidden' | 'scroll'
  : T extends 'position'
  ? 'absolute' | 'relative'
  : T extends 'shadowOffset' | 'textShadowOffset'
  ? { width?: number; height?: number }
  : T extends 'fontWeight'
  ? 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' // prettier-ignore
  : T extends 'fontVariant'
  ? 'small-caps' | 'oldstyle-nums' | 'lining-nums' | 'tabular-nums' | 'proportional-nums' // prettier-ignore
  : T extends 'textAlign'
  ? 'auto' | 'top' | 'bottom' | 'center'
  : T extends 'textDecorationLine'
  ? 'auto' | 'top' | 'bottom' | 'center'
  : T extends 'textDecorationStyle'
  ? 'solid' | 'double' | 'dotted' | 'dashed'
  : T extends 'textTransform'
  ? 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  : T extends 'writingDirection'
  ? 'auto' | 'ltr' | 'rtl'
  : T extends 'backfaceVisibility'
  ? 'visible' | 'hidden'
  : T extends StringProperty
  ? string
  : T extends NumberProperty
  ? number
  : T extends BooleanProperty
  ? boolean
  : never;

export type StyledPrimitive =
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

export type PolymorphicProps<T extends StyledPrimitive> = T extends 'Button'
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
