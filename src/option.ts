import { Err, Ok, Result } from './result';

type filter<I> = (arg: I) => boolean;
type map<I, O> = (arg: I) => O;

export interface Option<T> {
  isSome: () => this is _Some<T>
  isNone: () => this is _None<T>
  map: <U>(map: map<T, U>) => Option<U>
  unwrap: () => T
  unwrapOr: (arg: T) => T
  andThen: <U>(map: map<T, Option<U>>) => Option<U>
  filter: (filter: filter<T>) => Option<T>
  or: (opt: Option<T>) => Option<T>
  okOr: <E>(err: E) => Result<E, T>
}

class _Some<T> implements Option<T> {
  constructor (private readonly value: T) {}
  isSome (): this is _Some<T> {
    return true;
  }

  isNone (): this is _None<T> {
    return false;
  }

  map<U>(f: map<T, U>): Option<U> {
    return Some(f(this.value));
  }

  unwrap (): T {
    return this.value;
  }

  unwrapOr (): T {
    return this.value;
  }

  andThen<U>(map: map<T, Option<U>>): Option<U> {
    return map(this.value);
  }

  filter (filter: filter<T>): Option<T> {
    if (filter(this.value)) return this;
    return None();
  }

  or (): Option<T> {
    return this;
  }

  okOr<E>(): Result<E, T> {
    return Ok(this.value);
  }
}

class _None<T> implements Option<T> {
  isSome (): this is _Some<T> {
    return false;
  }

  isNone (): this is _None<T> {
    return true;
  }

  map<U>(): Option<U> {
    return this as unknown as Option<U>;
  }

  unwrap (): T {
    throw new Error('Tried to unwrap a None!');
  }

  unwrapOr (arg: T): T {
    return arg;
  }

  andThen<U>(): Option<U> {
    return this as unknown as Option<U>;
  }

  filter (): Option<T> {
    return this;
  }

  or (optb: Option<T>): Option<T> {
    return optb;
  }

  okOr<E>(error: E): Result<E, T> {
    return Err(error);
  }
}

export const Some = <T>(arg: T): Option<T> => new _Some(arg);

export const None = <T>(): Option<T> => new _None();
