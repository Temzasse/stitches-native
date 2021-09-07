/* eslint-disable */

export interface ScaleValue {
  token: number | string;
  value: number | string;
  scale: string;
}

export interface Token<
  /** Token name. */
  NameType extends number | string = string,
  /** Token value. */
  ValueType extends number | string = string,
  /** Token scale. */
  ScaleType extends string | void = void
> extends ScaleValue {
  new (name: NameType, value: ValueType, scale?: ScaleType): this;

  /** Name of the token. */
  token: NameType;

  /** Value of the token. */
  value: ValueType;

  /** Category of interface the token applies to. */
  scale: ScaleType extends string ? ScaleType : '';

  /** Returns variable prefixed with `$` representing the token. */
  toString(): `$(${this['token']})`;
}
