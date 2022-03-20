/* eslint-disable */

/* Utilities */
/* ========================================================================== */

/** Returns a string with the given prefix followed by the given values. */
export type Prefixed<K extends string, T> = `${K}${Extract<
  T,
  boolean | number | string
>}`;

/** Returns an object from the given object assigned with the values of another given object. */
export type Assign<T1 = {}, T2 = {}> = Omit<T1, keyof T2> & T2;

/** Returns a widened value from the given value. */
export type Widen<T> = T extends number
  ? `${T}` | T
  : T extends 'true'
  ? boolean | T
  : T extends 'false'
  ? boolean | T
  : T extends `${number}`
  ? number | T
  : T;

/** Narrowed string. */
export type String = string & Record<never, never>;

/** Narrowed number or string. */
export type Index = (number | string) & Record<never, never>;

/** Narrowed function. */
export type Function = (...args: any[]) => unknown;

/** Widened object. */
export type WideObject = {
  [name in number | string]: boolean | number | string | undefined | WideObject;
};

/* Util for aliases tokens. Returns the aliased token if it's an alias, returns never if it's not. */
export type AliasedToken<V extends string> = V extends `${infer Head}${infer Tail}`
  ? Head extends "$"
    ? Tail
    : never
  : never;