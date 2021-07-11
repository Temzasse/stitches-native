import { CSSPropertiesToTokenScale, TStyledSheet } from './core';
import { ReactFactory, StyledInstance } from './styled';

export declare const createCss: ReactFactory;
export declare const styled: StyledInstance<{ initial: '' }, {}, {}, CSSPropertiesToTokenScale>; // prettier-ignore
export declare const css: TStyledSheet<{ initial: '' }, {}, {}, '', CSSPropertiesToTokenScale>; // prettier-ignore
export default createCss;
