type Head<StrT extends string> = StrT extends `${infer HeadT}${string}`
  ? HeadT
  : never;

type Tail<StrT extends string> = StrT extends `${string}${infer TailT}`
  ? TailT
  : never;

interface Dfa {
  startState: string;
  acceptStates: string;
  transitions: Record<string, Record<string, string>>;
}

type AcceptsImpl<
  DfaT extends Dfa,
  StateT extends string,
  InputT extends string
> = InputT extends ''
  ? StateT extends DfaT['acceptStates']
    ? true
    : false
  : AcceptsImpl<DfaT, DfaT['transitions'][StateT][Head<InputT>], Tail<InputT>>;

export type Accepts<DfaT extends Dfa, InputT extends string> = AcceptsImpl<
  DfaT,
  DfaT['startState'],
  InputT
>;

type HexChar =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'E'
  | 'F';

interface HexStringLen6 {
  startState: '0';
  acceptStates: '6';
  transitions: {
    '0': Record<HexChar, '1'> & Record<string, 'fail'>;
    '1': Record<HexChar, '2'> & Record<string, 'fail'>;
    '2': Record<HexChar, '3'> & Record<string, 'fail'>;
    '3': Record<HexChar, '4'> & Record<string, 'fail'>;
    '4': Record<HexChar, '5'> & Record<string, 'fail'>;
    '5': Record<HexChar, '6'> & Record<string, 'fail'>;
    '6': Record<string, 'fail'>;
    fail: Record<string, 'fail'>;
  };
}

export type HexColor<T extends string> = Accepts<HexStringLen6, T> extends true
  ? T
  : never;


type X = HexColor<'EEEEEE'>