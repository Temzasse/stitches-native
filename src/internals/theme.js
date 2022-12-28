import { THEME_VALUES } from './constants';

export function processThemeMap(themeMap) {
  const definition = {};

  Object.keys(themeMap).forEach((token) => {
    const scale = themeMap[token];

    if (!definition[scale]) {
      definition[scale] = {};
    }

    definition[scale][token] = scale;
  });

  return definition;
}

export function processTheme(theme) {
  const definition = {};
  const values = {};

  Object.keys(theme).forEach((scale) => {
    if (!definition[scale]) definition[scale] = {};
    if (!values[scale]) values[scale] = {};

    Object.keys(theme[scale]).forEach((token) => {
      let value = theme[scale][token];

      if (typeof value === 'string' && value.length > 1 && value[0] === '$') {
        value = theme[scale][value.replace('$', '')];
      }

      values[scale][token] = value;

      definition[scale][token] = {
        token,
        scale,
        value,
        toString: () => `$${token}`,
      };
    });
  });

  return { definition, values };
}

export function getThemeKey(theme, themeMap, key) {
  return Object.keys(THEME_VALUES).find((themeKey) => {
    return key in (themeMap[themeKey] || {}) && theme?.[themeKey];
  });
}
