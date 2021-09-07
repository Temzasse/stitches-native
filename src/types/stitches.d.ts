/* eslint-disable */
import type * as CSSUtil from './css-util';
import type * as StyledComponent from './styled-component';
import type * as Native from './react-native';
import type * as Util from './util';
import type * as ThemeUtil from './theme';

/** Remove an index signature from a type */
export type RemoveIndex<T> = {
  [k in keyof T as string extends k
    ? never
    : number extends k
    ? never
    : k]: T[k];
};

/** Stitches interface. */
export default interface Stitches<
  Media extends {} = {},
  Theme extends {} = {},
  ThemeMap extends {} = {},
  Utils extends {} = {}
> {
  config: {
    media: Media;
    theme: Theme;
    themeMap: ThemeMap;
    utils: Utils;
  };
  createTheme: {
    <
      Argument0 extends {
        [Scale in keyof Theme]?: {
          [Token in keyof Theme[Scale]]?: boolean | number | string;
        };
      } &
        {
          [scale in string]: {
            [token in number | string]: boolean | number | string;
          };
        }
    >(
      arg0: Argument0
    ): string & ThemeTokens<Argument0>;
  };
  theme: string &
    {
      [Scale in keyof Theme]: {
        [Token in keyof Theme[Scale]]: ThemeUtil.Token<
          Extract<Token, string | number>,
          string,
          Extract<Scale, string | void>
        >;
      };
    };
  useTheme: () => string &
    {
      [Scale in keyof Theme]: {
        [Token in keyof Theme[Scale]]: ThemeUtil.Token<
          Extract<Token, string | number>,
          string,
          Extract<Scale, string | void>
        >;
      };
    };
  ThemeProvider: React.FunctionComponent<{
    theme?: string &
      {
        [Scale in keyof Theme]: {
          [Token in keyof Theme[Scale]]: ThemeUtil.Token<
            Extract<Token, string | number>,
            string,
            Extract<Scale, string | void>
          >;
        };
      };
  }>;
  css: {
    <
      Composers extends (
        | string
        | React.ExoticComponent<any>
        | React.JSXElementConstructor<any>
        | Util.Function
        | { [name: string]: unknown }
      )[],
      CSS = CSSUtil.CSS<Media, Theme, ThemeMap, Utils>
    >(
      ...composers: {
        [K in keyof Composers]: Composers[K] extends  // Strings, React Components, and Functions can be skipped over
          | string
          | React.ExoticComponent<any>
          | React.JSXElementConstructor<any>
          | Util.Function
          ? Composers[K]
          : RemoveIndex<CSS> & {
              /** The **variants** property lets you set a subclass of styles based on a key-value pair.
               *
               * [Read Documentation](https://stitches.dev/docs/variants)
               */
              variants?: {
                [Name in string]: {
                  [Pair in number | string]: CSS;
                };
              };
              /** The **variants** property lets you to set a subclass of styles based on a combination of active variants.
               *
               * [Read Documentation](https://stitches.dev/docs/variants#compound-variants)
               */
              compoundVariants?: (('variants' extends keyof Composers[K]
                ? {
                    [Name in keyof Composers[K]['variants']]?:
                      | Util.Widen<keyof Composers[K]['variants'][Name]>
                      | Util.String;
                  } &
                    Util.WideObject
                : Util.WideObject) & {
                css: CSS;
              })[];
              /** The **defaultVariants** property allows you to predefine the active key-value pairs of variants.
               *
               * [Read Documentation](https://stitches.dev/docs/variants#default-variants)
               */
              defaultVariants?: 'variants' extends keyof Composers[K]
                ? {
                    [Name in keyof Composers[K]['variants']]?:
                      | Util.Widen<keyof Composers[K]['variants'][Name]>
                      | Util.String;
                  }
                : Util.WideObject;
            } & {
                [K2 in keyof Composers[K]]: K2 extends
                  | 'compoundVariants'
                  | 'defaultVariants'
                  | 'variants'
                  ? unknown
                  : K2 extends keyof CSS
                  ? CSS[K2]
                  : unknown;
              };
      }
    ): any; // TODO: figure out what this type should be...
  };
  styled: {
    <
      Type extends
        | Native.ReactNativeElementsKeys
        | React.ComponentType<any>
        | Util.Function,
      Composers extends (
        | string
        | React.ComponentType<any>
        | Util.Function
        | { [name: string]: unknown }
      )[],
      CSS = CSSUtil.CSS<Media, Theme, ThemeMap, Utils>
    >(
      type: Type,
      ...composers: {
        [K in keyof Composers]: Composers[K] extends  // Strings, React Components, and Functions can be skipped over
          | string
          | React.ComponentType<any>
          | Util.Function
          ? Composers[K]
          : RemoveIndex<CSS> & {
              /** The **variants** property lets you set a subclass of styles based on a key-value pair.
               *
               * [Read Documentation](https://stitches.dev/docs/variants)
               */
              variants?: {
                [Name in string]: {
                  [Pair in number | string]: CSS;
                };
              };
              /** The **variants** property lets you to set a subclass of styles based on a combination of active variants.
               *
               * [Read Documentation](https://stitches.dev/docs/variants#compound-variants)
               */
              compoundVariants?: (('variants' extends keyof Composers[K]
                ? {
                    [Name in keyof Composers[K]['variants']]?:
                      | Util.Widen<keyof Composers[K]['variants'][Name]>
                      | Util.String;
                  } &
                    Util.WideObject
                : Util.WideObject) & {
                css: CSS;
              })[];
              /** The **defaultVariants** property allows you to predefine the active key-value pairs of variants.
               *
               * [Read Documentation](https://stitches.dev/docs/variants#default-variants)
               */
              defaultVariants?: 'variants' extends keyof Composers[K]
                ? {
                    [Name in keyof Composers[K]['variants']]?:
                      | Util.Widen<keyof Composers[K]['variants'][Name]>
                      | Util.String;
                  }
                : Util.WideObject;
            } & {
                [K2 in keyof Composers[K]]: K2 extends
                  | 'compoundVariants'
                  | 'defaultVariants'
                  | 'variants'
                  ? unknown
                  : K2 extends keyof CSS
                  ? CSS[K2]
                  : unknown;
              };
      }
    ): StyledComponent.StyledComponent<
      Type,
      StyledComponent.StyledComponentProps<Composers>,
      Media,
      CSSUtil.CSS<Media, Theme, ThemeMap, Utils>
    >;
  };
}

type ThemeTokens<Values> = {
  [Scale in keyof Values]: {
    [Token in keyof Values[Scale]]: ThemeUtil.Token<
      Extract<Token, number | string>,
      Values[Scale][Token],
      Extract<Scale, string | void>
    >;
  };
};
