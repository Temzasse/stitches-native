import * as internals from './internals';
import type { CSSPropertiesToTokenScale } from './types/core';
import type { ReactFactory, StyledInstance } from './types/styled';

// NOTE: this index file is only used by the example Expo app in order to get typings working properly in the app
export const createCss = internals.createCss as unknown as ReactFactory;
export const styled = (internals.styled as unknown) as StyledInstance<{ initial: '' }, {}, {}, CSSPropertiesToTokenScale>; // prettier-ignore
export const css = internals.css as unknown as any; // TODO: add type!
export default createCss;
