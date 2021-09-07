// NOTE: this index file is only used by the example Expo app in order to get typings working properly in the app

import * as internals from './internals';
import type Stitches from './types/stitches';
import type * as Config from './types/config';
import type * as CSSUtil from './types/css-util';
import type * as StyledComponent from './types/styled-component';

export type CreateStitches = Config.CreateStitches;
export type CSSProperties = CSSUtil.CSSProperties;
export type DefaultThemeMap = Config.DefaultThemeMap;

/** Returns a Style interface from a configuration, leveraging the given media and style map. */

export type CSS<
  Config extends {
    media?: {};
    theme?: {};
    themeMap?: {};
    utils?: {};
  } = {
    media: {};
    theme: {};
    themeMap: {};
    utils: {};
  }
> = CSSUtil.CSS<
  Config['media'],
  Config['theme'],
  Config['themeMap'],
  Config['utils']
>;

/** Returns the properties, attributes, and children expected by a component. */
export type ComponentProps<Component> = Component extends (
  ...args: any[]
) => any
  ? Parameters<Component>[0]
  : never;

/** Returns a type that expects a value to be a kind of CSS property value. */
export type PropertyValue<K extends keyof CSSUtil.CSSProperties> = {
  readonly [CSSUtil.$$PropertyValue]: K;
};

/** Returns a type that expects a value to be a kind of theme scale value. */
export type ScaleValue<K> = { readonly [CSSUtil.$$ScaleValue]: K };

/** Returns a type that suggests variants from a component as possible prop values. */
export type VariantProps<Component> = StyledComponent.TransformProps<
  Component[StyledComponent.$$StyledComponentProps], // TODO: why does TS complain here but not in `index.d.ts`?
  Component[StyledComponent.$$StyledComponentMedia]
>;

export const defaultThemeMap = internals.defaultThemeMap as unknown as Config.DefaultThemeMap; // prettier-ignore

export const createStitches = internals.createStitches as unknown as Config.CreateStitches; // prettier-ignore

export const styled = internals.styled as unknown as Stitches['styled'];

export const css = internals.css as unknown as Stitches['css'];

// TODO: should we export `createTheme`? How would that be used in RN?
