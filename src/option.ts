import { Err, Ok, Result } from './result';

type filter<I> = (arg: I) => boolean;
type map<I, O> = (arg: I) => O;
type FlattenOption<T> = T extends Option<(infer T2)> ? Option<T2> : Option<T>;

export interface Option<T> {
  and: (opt: Option<T>) => Option<T>
  andThen: <U>(map: map<T, Option<U>>) => Option<U>
  contains: <T2 extends T>(value: T2) => this is Option<T2>
  filter: (filter: filter<T>) => Option<T>
  flatten: () => FlattenOption<T>
  isNone: () => this is _None<T>
  isSome: () => this is _Some<T>
  isSomeAnd: (condition: filter<T>) => boolean
  iter: () => T[]
  map: <U>(map: map<T, U>) => Option<U>
  okOr: <E>(err: E) => Result<E, T>
  or: (opt: Option<T>) => Option<T>
  unwrap: () => T
  unwrapOr: (arg: T) => T
}

class _Some<T> implements Option<T> {
  constructor (private readonly value: T) {}

  and (option: Option<T>): Option<T> {
    return option;
  }

  andThen<U>(map: map<T, Option<U>>): Option<U> {
    return map(this.value);
  }

  contains<T2 extends T>(value: T2): this is _Some<T2> {
    return this.value === value;
  }

  filter (filter: filter<T>): Option<T> {
    if (filter(this.value)) return this;
    return None();
  }

  flatten (): FlattenOption<T> {
    if (this.value instanceof _Some) return this.value as unknown as FlattenOption<T>;
    if (this.value instanceof _None) return this.value as unknown as FlattenOption<T>;
    return this as unknown as FlattenOption<T>;
  }

  isNone (): false {
    return false;
  }

  isSome (): true {
    return true;
  }

  isSomeAnd (condition: filter<T>): boolean {
    return condition(this.value);
  }

  iter (): T[] {
    return [this.value];
  }

  map<U>(f: map<T, U>): Option<U> {
    return Some(f(this.value));
  }

  okOr<E>(): Result<E, T> {
    return Ok(this.value);
  }

  or (): Option<T> {
    return this;
  }

  unwrap (): T {
    return this.value;
  }

  unwrapOr (): T {
    return this.value;
  }
}

class _None<T> implements Option<T> {
  and (): Option<T> {
    return this;
  }

  andThen<U>(): Option<U> {
    return this as unknown as Option<U>;
  }

  contains (): false {
    return false;
  }

  filter (): Option<T> {
    return this;
  }

  flatten (): FlattenOption<T> {
    return this as unknown as FlattenOption<T>;
  }

  isNone (): true {
    return true;
  }

  isSome (): false {
    return false;
  }

  isSomeAnd (): boolean {
    return false;
  }

  iter (): T[] {
    return [];
  }

  map<U>(): Option<U> {
    return this as unknown as Option<U>;
  }

  okOr<E>(error: E): Result<E, T> {
    return Err(error);
  }

  or (optb: Option<T>): Option<T> {
    return optb;
  }

  unwrap (): T {
    throw new Error('Tried to unwrap a None!');
  }

  unwrapOr (arg: T): T {
    return arg;
  }
}

export const Some = <T>(arg: T): Option<T> => new _Some(arg);

export const None = <T>(): Option<T> => new _None();
