import * as React from 'react';

import {
  ButtonProps,
  FlatListProps,
  ImageBackgroundProps,
  ImageProps,
  ImageStyle,
  InputAccessoryViewProps,
  KeyboardAvoidingViewProps,
  OpaqueColorValue,
  PressableProps,
  ScrollViewProps,
  SectionListProps,
  TextInputProps,
  TextProps,
  TextStyle,
  TouchableHighlightProps,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
  TouchableWithoutFeedbackProps,
  ViewProps,
  ViewStyle,
  VirtualizedListProps,
} from 'react-native';

type StringProperty = string & {};
type ColorProperty = OpaqueColorValue | (string & {});
type SimpleNumberProperty = number | (string & {});
type NumberProperty<TLength> = TLength | number | (string & {});
// TODO: do we need both `SimpleNumberProperty` and `NumberProperty`?

export interface ReactNativeProperties<TLength = (string & {}) | 0> {
  alignContent: ViewStyle['alignContent'];
  alignItems: ViewStyle['alignItems'];
  alignSelf: ViewStyle['alignSelf'];
  aspectRatio: SimpleNumberProperty;
  backfaceVisibility: ViewStyle['backfaceVisibility'];
  backgroundColor: ColorProperty;
  borderBottomColor: ColorProperty;
  borderBottomEndRadius: SimpleNumberProperty;
  borderBottomLeftRadius: SimpleNumberProperty;
  borderBottomRightRadius: SimpleNumberProperty;
  borderBottomStartRadius: SimpleNumberProperty;
  borderBottomWidth: NumberProperty<TLength>;
  borderColor: ColorProperty;
  borderEndColor: ColorProperty;
  borderEndWidth: NumberProperty<TLength>;
  borderLeftColor: ColorProperty;
  borderLeftWidth: NumberProperty<TLength>;
  borderRadius: SimpleNumberProperty;
  borderRightColor: ColorProperty;
  borderRightWidth: NumberProperty<TLength>;
  borderStartColor: ColorProperty;
  borderStartWidth: NumberProperty<TLength>;
  borderStyle: ViewStyle['borderStyle'];
  borderTopColor: ColorProperty;
  borderTopEndRadius: SimpleNumberProperty;
  borderTopLeftRadius: SimpleNumberProperty;
  borderTopRightRadius: SimpleNumberProperty;
  borderTopStartRadius: SimpleNumberProperty;
  borderTopWidth: NumberProperty<TLength>;
  borderWidth: NumberProperty<TLength>;
  bottom: NumberProperty<TLength>;
  color: ColorProperty;
  direction: ViewStyle['direction'];
  display: ViewStyle['display'];
  elevation: NumberProperty<TLength>;
  end: SimpleNumberProperty;
  flex: NumberProperty<TLength>;
  flexBasis: NumberProperty<TLength>;
  flexDirection: ViewStyle['flexDirection'];
  flexGrow: NumberProperty<TLength>;
  flexShrink: NumberProperty<TLength>;
  flexWrap: ViewStyle['flexWrap'];
  fontFamily: StringProperty;
  fontSize: NumberProperty<TLength>;
  fontStyle: TextStyle['fontStyle'];
  fontVariant: TextStyle['fontVariant'];
  fontWeight: TextStyle['fontWeight'];
  height: NumberProperty<TLength>;
  includeFontPadding: TextStyle['includeFontPadding'];
  justifyContent: ViewStyle['justifyContent'];
  left: NumberProperty<TLength>;
  letterSpacing: NumberProperty<TLength>;
  lineHeight: NumberProperty<TLength>;
  margin: NumberProperty<TLength>;
  marginBottom: NumberProperty<TLength>;
  marginEnd: NumberProperty<TLength>;
  marginHorizontal: NumberProperty<TLength>;
  marginLeft: NumberProperty<TLength>;
  marginRight: NumberProperty<TLength>;
  marginStart: NumberProperty<TLength>;
  marginTop: NumberProperty<TLength>;
  marginVertical: NumberProperty<TLength>;
  maxHeight: NumberProperty<TLength>;
  maxWidth: NumberProperty<TLength>;
  minHeight: NumberProperty<TLength>;
  minWidth: NumberProperty<TLength>;
  opacity: SimpleNumberProperty;
  overflow: ViewStyle['overflow'];
  overlayColor: ColorProperty;
  padding: NumberProperty<TLength>;
  paddingBottom: NumberProperty<TLength>;
  paddingEnd: NumberProperty<TLength>;
  paddingHorizontal: NumberProperty<TLength>;
  paddingLeft: NumberProperty<TLength>;
  paddingRight: NumberProperty<TLength>;
  paddingStart: NumberProperty<TLength>;
  paddingTop: NumberProperty<TLength>;
  paddingVertical: NumberProperty<TLength>;
  position: ViewStyle['position'];
  resizeMode: ImageStyle['resizeMode'];
  right: NumberProperty<TLength>;
  shadowColor: ColorProperty;
  shadowOffset: ViewStyle['shadowOffset'];
  shadowOpacity: SimpleNumberProperty;
  shadowRadius: SimpleNumberProperty;
  start: NumberProperty<TLength>;
  textAlign: TextStyle['textAlign'];
  textDecorationColor: ColorProperty;
  textDecorationLine: TextStyle['textDecorationLine'];
  textDecorationStyle: TextStyle['textDecorationStyle'];
  textShadowColor: ColorProperty;
  textShadowOffset: TextStyle['textShadowOffset'];
  textShadowRadius: SimpleNumberProperty;
  textTransform: TextStyle['textTransform'];
  tintColor: ColorProperty;
  top: NumberProperty<TLength>;
  width: NumberProperty<TLength>;
  writingDirection: TextStyle['writingDirection'];
  zIndex: SimpleNumberProperty;
}

type PropsWithChildren<T> = T & { children?: React.ReactNode };

export type ReactNativeElements = {
  Button: PropsWithChildren<ButtonProps>;
  FlatList: FlatListProps<any>;
  Image: PropsWithChildren<ImageProps>;
  ImageBackground: PropsWithChildren<ImageBackgroundProps>;
  InputAccessoryView: PropsWithChildren<InputAccessoryViewProps>;
  KeyboardAvoidingView: PropsWithChildren<KeyboardAvoidingViewProps>;
  Pressable: PropsWithChildren<PressableProps>;
  SafeAreaView: PropsWithChildren<ViewProps>;
  ScrollView: PropsWithChildren<ScrollViewProps>;
  SectionList: SectionListProps<any>;
  Text: PropsWithChildren<TextProps>;
  TextInput: PropsWithChildren<TextInputProps>;
  TouchableHighlight: PropsWithChildren<TouchableHighlightProps>;
  TouchableNativeFeedback: PropsWithChildren<TouchableNativeFeedbackProps>;
  TouchableOpacity: PropsWithChildren<TouchableOpacityProps>;
  TouchableWithoutFeedback: PropsWithChildren<TouchableWithoutFeedbackProps>;
  View: PropsWithChildren<ViewProps>;
  VirtualizedList: VirtualizedListProps<any>;
};

export type ReactNativeElementsKeys = keyof ReactNativeElements;

// prettier-ignore
export type ReactNativeElementType<P = any> =
  | { [K in ReactNativeElementsKeys]: P extends ReactNativeElements[K] ? K : never }[ReactNativeElementsKeys]
  | React.ComponentType<P>;

type ReactNativeComponentProps<
  T extends ReactNativeElementsKeys | React.JSXElementConstructor<any>
> = T extends React.JSXElementConstructor<infer P>
  ? P
  : T extends ReactNativeElementsKeys
  ? ReactNativeElements[T]
  : {};

export type ReactNativeComponentPropsWithRef<T extends ReactNativeElementType> =
  T extends React.ComponentClass<infer P>
    ? React.PropsWithoutRef<P> & React.RefAttributes<InstanceType<T>>
    : React.PropsWithRef<ReactNativeComponentProps<T>>;
