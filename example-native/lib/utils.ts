import { Config } from './types';
import { DEFAULT_THEME_MAP } from './constants';

export function getCompoundKey(compoundEntries: Array<[string, any]>) {
  // Eg. `color_primary+size_small`
  return (
    compoundEntries
      // Sort compound entries alphabetically
      .sort((a, b) => {
        if (a[0] < b[0]) return -1;
        if (a[0] > b[0]) return 1;
        return 0;
      })
      .reduce((keyAcc, [prop, value]) => {
        return keyAcc + `${prop}_${value}+`;
      }, '')
      .slice(0, -1)
  ); // Remove last `+` character
}

export function processStyles(
  styles: { [property: string]: string | number },
  config: Config
) {
  const themeMap = (config.themeMap || DEFAULT_THEME_MAP) as any;

  return Object.entries(styles).reduce((acc, [key, val]) => {
    const { theme, utils } = config;

    if (typeof val === 'string' && val.indexOf('$') !== -1) {
      const token = (val as string).replace('$', '');

      if (key in themeMap.colors && theme?.colors) {
        acc[key] = theme.colors[token];
      } else if (key in themeMap.radii && theme?.radii) {
        acc[key] = theme.radii[token];
      } else if (key in themeMap.sizes && theme?.sizes) {
        acc[key] = theme.sizes[token];
      } else if (key in themeMap.space && theme?.space) {
        acc[key] = theme.space[token];
      } else if (key in themeMap.borderStyles && theme?.borderStyles) {
        acc[key] = theme.borderStyles[token];
      } else if (key in themeMap.borderWidths && theme?.borderWidths) {
        acc[key] = theme.borderWidths[token];
      } else if (key in themeMap.fonts && theme?.fonts) {
        acc[key] = theme.fonts[token];
      } else if (key in themeMap.fontSizes && theme?.fontSizes) {
        acc[key] = theme.fontSizes[token];
      } else if (key in themeMap.fontWeights && theme?.fontWeights) {
        acc[key] = theme.fontWeights[token];
      } else if (key in themeMap.letterSpacings && theme?.letterSpacings) {
        acc[key] = theme.letterSpacings[token];
      } else if (key in themeMap.lineHeights && theme?.lineHeights) {
        acc[key] = theme.lineHeights[token];
      } else if (key in themeMap.zIndices && theme?.zIndices) {
        acc[key] = theme.zIndices[token];
      }
    } else if (utils && key in utils) {
      acc = { ...acc, ...utils[key](config)(val) };
    } else {
      acc[key] = val;
    }

    return acc;
  }, {} as any);
}
