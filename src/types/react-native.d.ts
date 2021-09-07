import * as React from 'react';

import {
  ButtonProps,
  FlatListProps,
  ImageBackgroundProps,
  ImageProps,
  InputAccessoryViewProps,
  KeyboardAvoidingViewProps,
  PressableProps,
  ScrollViewProps,
  SectionListProps,
  TextInputProps,
  TextProps,
  TouchableHighlightProps,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
  TouchableWithoutFeedbackProps,
  ViewProps,
  VirtualizedListProps,
} from 'react-native';

type AlignContentProperty = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around' | (string & {}); // prettier-ignore
type AlignItemsProperty = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | (string & {}); // prettier-ignore
type AlignSelfProperty = 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline' | (string & {}); // prettier-ignore
type BackfaceVisibilityProperty = 'visible' | 'hidden' | (string & {});
type BorderStyleProperty = 'solid' | 'dotted' | 'dashed' | (string & {});
type DirectionProperty = 'inherit' | 'ltr' | 'rtl' | (string & {});
type DisplayProperty = 'auto' | 'flex' | (string & {});
type FlexDirectionProperty = 'row' | 'row-reverse' | 'column' | 'column-reverse' | (string & {}); // prettier-ignore
type FlexWrapProperty = 'wrap' | 'nowrap' | 'wrap-reverse' | (string & {});
type FontSizeProperty<TLength> = TLength | number | (string & {});
type FontStyleProperty = 'italic' | 'normal' | 'oblique' | (string & {});
type FontVariantProperty = 'small-caps' | 'oldstyle-nums' | 'lining-nums' | 'tabular-nums' | 'proportional-nums' | (string & {}); // prettier-ignore
type FontWeightProperty = 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | (string & {}); // prettier-ignore
type IncludeFontPaddingProperty = boolean | (string & {});
type JustifyContentProperty = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly' | (string & {}); // prettier-ignore
type NumberProperty<TLength> = TLength | number | (string & {});
type OverflowProperty = 'visible' | 'hidden' | 'scroll' | (string & {});
type PaddingMarginProperty<TLength> = TLength | number | (string & {});
type PositionProperty = 'absolute' | 'relative' | (string & {});
type ShadowOffsetProperty = { width?: number; height?: number } | (string & {});
type SimpleNumberProperty = number | (string & {});
type StringNumberProperty<TLength> = TLength | number | (string & {});
type StringProperty = string & {};
type TextAlignProperty = 'auto' | 'top' | 'bottom' | 'center' | (string & {});
type TextDecorationLineProperty = 'auto' | 'top' | 'bottom' | 'center' | (string & {}); // prettier-ignore
type TextDecorationStyleProperty = 'solid' | 'double' | 'dotted' | 'dashed' | (string & {}); // prettier-ignore
type TextShadowOffsetProperty =  { width?: number; height?: number } | (string & {}); // prettier-ignore
type TextTransformProperty = 'none' | 'uppercase' | 'lowercase' | 'capitalize' | (string & {}); // prettier-ignore
type WritingDirectionProperty = 'auto' | 'ltr' | 'rtl' | (string & {});
type ResizeModeProperty = 'cover' | 'contain' | 'stretch' | 'repeat' | 'center' | (string & {}); // prettier-ignore

export interface ReactNativeProperties<TLength = (string & {}) | 0> {
  alignContent: AlignContentProperty;
  alignItems: AlignItemsProperty;
  alignSelf: AlignSelfProperty;
  aspectRatio: SimpleNumberProperty;
  backfaceVisibility: BackfaceVisibilityProperty;
  backgroundColor: StringProperty;
  borderBottomColor: StringProperty;
  borderBottomEndRadius: SimpleNumberProperty;
  borderBottomLeftRadius: SimpleNumberProperty;
  borderBottomRightRadius: SimpleNumberProperty;
  borderBottomStartRadius: SimpleNumberProperty;
  borderBottomWidth: NumberProperty<TLength>;
  borderColor: StringProperty;
  borderEndColor: StringProperty;
  borderEndWidth: StringNumberProperty<TLength>;
  borderLeftColor: StringProperty;
  borderLeftWidth: NumberProperty<TLength>;
  borderRadius: SimpleNumberProperty;
  borderRightColor: StringProperty;
  borderRightWidth: NumberProperty<TLength>;
  borderStartColor: StringProperty;
  borderStartWidth: StringNumberProperty<TLength>;
  borderStyle: BorderStyleProperty;
  borderTopColor: StringProperty;
  borderTopEndRadius: SimpleNumberProperty;
  borderTopLeftRadius: SimpleNumberProperty;
  borderTopRightRadius: SimpleNumberProperty;
  borderTopStartRadius: SimpleNumberProperty;
  borderTopWidth: NumberProperty<TLength>;
  borderWidth: NumberProperty<TLength>;
  bottom: StringNumberProperty<TLength>;
  color: StringProperty;
  direction: DirectionProperty;
  display: DisplayProperty;
  elevation: NumberProperty<TLength>;
  end: SimpleNumberProperty;
  flex: NumberProperty<TLength>;
  flexBasis: StringNumberProperty<TLength>;
  flexDirection: FlexDirectionProperty;
  flexGrow: NumberProperty<TLength>;
  flexShrink: NumberProperty<TLength>;
  flexWrap: FlexWrapProperty;
  fontFamily: StringProperty;
  fontSize: FontSizeProperty<TLength>;
  fontStyle: FontStyleProperty;
  fontVariant: FontVariantProperty;
  fontWeight: FontWeightProperty;
  height: StringNumberProperty<TLength>;
  includeFontPadding: IncludeFontPaddingProperty;
  justifyContent: JustifyContentProperty;
  left: StringNumberProperty<TLength>;
  letterSpacing: NumberProperty<TLength>;
  lineHeight: NumberProperty<TLength>;
  margin: PaddingMarginProperty<TLength>;
  marginBottom: PaddingMarginProperty<TLength>;
  marginEnd: PaddingMarginProperty<TLength>;
  marginHorizontal: PaddingMarginProperty<TLength>;
  marginLeft: PaddingMarginProperty<TLength>;
  marginRight: PaddingMarginProperty<TLength>;
  marginStart: PaddingMarginProperty<TLength>;
  marginTop: PaddingMarginProperty<TLength>;
  marginVertical: PaddingMarginProperty<TLength>;
  maxHeight: StringNumberProperty<TLength>;
  maxWidth: StringNumberProperty<TLength>;
  minHeight: StringNumberProperty<TLength>;
  minWidth: StringNumberProperty<TLength>;
  opacity: SimpleNumberProperty;
  overflow: OverflowProperty;
  overlayColor: StringProperty;
  padding: PaddingMarginProperty<TLength>;
  paddingBottom: PaddingMarginProperty<TLength>;
  paddingEnd: PaddingMarginProperty<TLength>;
  paddingHorizontal: PaddingMarginProperty<TLength>;
  paddingLeft: PaddingMarginProperty<TLength>;
  paddingRight: PaddingMarginProperty<TLength>;
  paddingStart: PaddingMarginProperty<TLength>;
  paddingTop: PaddingMarginProperty<TLength>;
  paddingVertical: PaddingMarginProperty<TLength>;
  position: PositionProperty;
  resizeMode: ResizeModeProperty;
  right: StringNumberProperty<TLength>;
  shadowColor: StringProperty;
  shadowOffset: ShadowOffsetProperty;
  shadowOpacity: SimpleNumberProperty;
  shadowRadius: SimpleNumberProperty;
  start: StringNumberProperty<TLength>;
  textAlign: TextAlignProperty;
  textDecorationColor: StringProperty;
  textDecorationLine: TextDecorationLineProperty;
  textDecorationStyle: TextDecorationStyleProperty;
  textShadowColor: StringProperty;
  textShadowOffset: TextShadowOffsetProperty;
  textShadowRadius: SimpleNumberProperty;
  textTransform: TextTransformProperty;
  tintColor: StringProperty;
  top: StringNumberProperty<TLength>;
  width: StringNumberProperty<TLength>;
  writingDirection: WritingDirectionProperty;
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
