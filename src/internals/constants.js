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
  fontWeights: 'fontWeights',
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
};

export const BORDER_STYLE_PROPERTIES = {
  borderStyle: 'borderStyles',
};

export const DEFAULT_THEME_MAP = {
  borderStyles: BORDER_STYLE_PROPERTIES,
  borderWidths: BORDER_WIDTH_PROPERTIES,
  colors: COLOR_PROPERTIES,
  fonts: FONT_PROPERTIES,
  fontSizes: FONT_SIZE_PROPERTIES,
  fontWeights: FONT_WEIGHT_PROPERTIES,
  letterSpacings: LETTER_SPACING_PROPERTIES,
  lineHeights: LINE_HEIGHT_PROPERTIES,
  radii: RADII_PROPERTIES,
  sizes: SIZE_PROPERTIES,
  space: SPACE_PROPERTIES,
  zIndices: Z_INDEX_PROPERTIES,
};

export const EMPTY_THEME = {
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

export const THEME_PROVIDER_MISSING_MESSAGE =
  'Your app should have a ThemeProvider in order to access the theme';
