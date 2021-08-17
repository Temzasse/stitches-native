import * as internals from './internals';
import type { CSSPropertiesToTokenScale } from './types/core';
import type { ReactFactory, StyledInstance } from './types/styled';

// NOTE: this index file is only used by the example Expo app in order to get typings working properly in the app
export const createStitches = internals.createStitches as unknown as ReactFactory; // prettier-ignore
export const styled = (internals.styled as unknown) as StyledInstance<{ initial: '' }, {}, {}, CSSPropertiesToTokenScale>; // prettier-ignore
export const css = internals.css as unknown as any; // TODO: add type!
export default createStitches;
