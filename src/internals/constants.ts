export const COLOR_PROPERTIES = {
  backgroundColor: 'colors',
  border: 'colors',
  borderBottomColor: 'colors',
  borderColor: 'colors',
  borderEndColor: 'colors',
  borderLeftColor: 'colors',
  borderRightColor: 'colors',
  borderStartColor: 'colors',
  borderTopColor: 'colors',
  color: 'colors',
  overlayColor: 'colors',
  shadowColor: 'colors',
  textDecoration: 'colors',
  textShadowColor: 'colors',
  tintColor: 'colors',
};

export const RADII_PROPERTIES = {
  borderBottomLeftRadius: 'radii',
  borderBottomRightRadius: 'radii',
  borderBottomStartRadius: 'radii',
  borderBottomEndRadius: 'radii',
  borderRadius: 'radii',
  borderTopLeftRadius: 'radii',
  borderTopRightRadius: 'radii',
  borderTopStartRadius: 'radii',
  borderTopEndRadius: 'radii',
};

export const SPACE_PROPERTIES = {
  bottom: 'space',
  left: 'space',
  margin: 'space',
  marginBottom: 'space',
  marginEnd: 'space',
  marginHorizontal: 'space',
  marginLeft: 'space',
  marginRight: 'space',
  marginStart: 'space',
  marginTop: 'space',
  marginVertical: 'space',
  padding: 'space',
  paddingBottom: 'space',
  paddingEnd: 'space',
  paddingHorizontal: 'space',
  paddingLeft: 'space',
  paddingRight: 'space',
  paddingStart: 'space',
  paddingTop: 'space',
  paddingVertical: 'space',
  right: 'space',
  top: 'space',
};

export const SIZE_PROPERTIES = {
  flexBasis: 'sizes',
  height: 'sizes',
  maxHeight: 'sizes',
  maxWidth: 'sizes',
  minHeight: 'sizes',
  minWidth: 'sizes',
  width: 'sizes',
};

export const FONT_PROPERTIES = {
  fontFamily: 'fonts',
};

export const FONT_SIZE_PROPERTIES = {
  fontSize: 'fontSizes',
};

export const FONT_WEIGHT_PROPERTIES = {
  fontWeight: 'fontWeights',
};

export const LINE_HEIGHT_PROPERTIES = {
  lineHeight: 'lineHeights',
};

export const LETTER_SPACING_PROPERTIES = {
  letterSpacing: 'letterSpacings',
};

export const Z_INDEX_PROPERTIES = {
  zIndex: 'zIndices',
};

export const BORDER_WIDTH_PROPERTIES = {
  borderWidth: 'borderWidths',
  borderTopWidth: 'borderWidths',
  borderRightWidth: 'borderWidths',
  borderBottomWidth: 'borderWidths',
  borderLeftWidth: 'borderWidths',
  borderEndWidth: 'borderWidths',
  borderStartWidth: 'borderWidths',
};

export const BORDER_STYLE_PROPERTIES = {
  borderStyle: 'borderStyles',
};

export const DEFAULT_THEME_MAP = {
  ...BORDER_STYLE_PROPERTIES,
  ...BORDER_WIDTH_PROPERTIES,
  ...COLOR_PROPERTIES,
  ...FONT_PROPERTIES,
  ...FONT_SIZE_PROPERTIES,
  ...FONT_WEIGHT_PROPERTIES,
  ...LETTER_SPACING_PROPERTIES,
  ...LINE_HEIGHT_PROPERTIES,
  ...RADII_PROPERTIES,
  ...SIZE_PROPERTIES,
  ...SPACE_PROPERTIES,
  ...Z_INDEX_PROPERTIES,
};

export type ThemeValues = {
  borderStyles: null | string | object | number;
  borderWidths: null | string | object | number;
  colors: null | string | object | number;
  fonts: null | string | object | number;
  fontSizes: null | string | object | number;
  fontWeights: null | string | object | number;
  letterSpacings: null | string | object | number;
  lineHeights: null | string | object | number;
  radii: null | string | object | number;
  sizes: null | string | object | number;
  space: null | string | object | number;
  zIndices: null | string | object | number;
};

export const THEME_VALUES: ThemeValues = {
  borderStyles: null,
  borderWidths: null,
  colors: null,
  fonts: null,
  fontSizes: null,
  fontWeights: null,
  letterSpacings: null,
  lineHeights: null,
  radii: null,
  sizes: null,
  space: null,
  zIndices: null,
};

export type StoredTheme = {
  definition: {
    __ID__: string;
  } & ThemeValues;
  values: ThemeValues;
};

export const EMPTY_THEME: StoredTheme = {
  definition: {
    __ID__: 'theme-0',
    ...THEME_VALUES,
  },
  values: {
    ...THEME_VALUES,
  },
};

export const THEME_PROVIDER_MISSING_MESSAGE =
  'Your app should have a ThemeProvider in order to access the theme';
