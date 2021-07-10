import * as internals from './internals';
import { DEFAULT_THEME_MAP } from './constants';
import { ReactFactory } from './types/styled';

export const createCss = (internals.createCss as unknown) as ReactFactory;
export const defaultThemeMap = DEFAULT_THEME_MAP;
