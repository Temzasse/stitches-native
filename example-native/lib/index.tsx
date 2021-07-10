import * as internals from './internals';
import { ReactFactory } from './types/styled';

export const createCss = (internals.createCss as unknown) as ReactFactory;
export const defaultThemeMap = internals.defaultThemeMap;
