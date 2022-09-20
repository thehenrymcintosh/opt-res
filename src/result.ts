import { None, Option, Some } from './option';

type map<I, O> = (arg: I) => O;

type FlattenResult<E, T> = T extends Result<(infer E2), (infer T2)> ? Result<E2, T2> : Result<E, T>;

export interface Result<E, T> {
  isErr: () => this is _Err<E, T>
  isOk: () => this is _Ok<E, T>
  ok: () => Option<T>
  err: () => Option<E>
  map: <U>(map: map<T, U>) => Result<E, U>
  unwrap: () => T
  unwrapOr: (arg: T) => T
  unwrapErr: () => E
  andThen: <U>(map: map<T, Result<E, U>>) => Result<E, U>
  reduce: <U>(errMap: map<E, U>, map: map<T, U>) => U
  contains: <U extends T>(value: U) => this is Result<E, U>
  containsErr: <U extends E>(err: U) => this is Result<U, T>
  flatten: () => FlattenResult<E, T>
}

class _Ok<E, T> implements Result<E, T> {
  constructor (private readonly value: T) {}
  isErr (): this is _Err<E, T> {
    return false;
  }

  isOk (): this is _Ok<E, T> {
    return true;
  }

  ok (): Option<T> {
    return Some(this.value);
  }

  err (): Option<E> {
    return None();
  }

  unwrap (): T {
    return this.value;
  }

  unwrapOr (): T {
    return this.value;
  }

  unwrapErr (): E {
    throw new Error('Tried to unwrapErr an Ok!');
  }

  map<U>(map: map<T, U>): Result<E, U> {
    return new _Ok(map(this.value));
  }

  andThen<U>(map: map<T, Result<E, U>>): Result<E, U> {
    return map(this.value);
  }

  reduce<U>(_errMap: map<E, U>, map: map<T, U>): U {
    return map(this.value);
  }

  contains<U extends T>(value: U): this is Result<E, U> {
    return this.value === value;
  }

  containsErr<U extends E>(): this is Result<U, T> {
    return false;
  }

  flatten (): FlattenResult<E, T> {
    if (this.value instanceof _Ok) return this.value as unknown as FlattenResult<E, T>;
    if (this.value instanceof _Err) return this.value as unknown as FlattenResult<E, T>;
    return this as unknown as FlattenResult<E, T>;
  }
}

class _Err<E, T> implements Result<E, T> {
  // eslint-disable-next-line n/handle-callback-err
  constructor (private readonly error: E) {}
  isErr (): this is _Err<E, T> {
    return true;
  }

  isOk (): this is _Ok<E, T> {
    return false;
  }

  ok (): Option<T> {
    return None();
  }

  err (): Option<E> {
    return Some(this.error);
  }

  unwrap (): T {
    throw new Error('Tried to unwrap an Err!');
  }

  unwrapOr (arg: T): T {
    return arg;
  }

  unwrapErr (): E {
    return this.error;
  }

  map<U>(): Result<E, U> {
    return this as unknown as Result<E, U>;
  }

  andThen<U>(): Result<E, U> {
    return this as unknown as Result<E, U>;
  }

  reduce<U>(errMap: map<E, U>): U {
    return errMap(this.error);
  }

  contains<U extends T>(): this is Result<E, U> {
    return false;
  }

  containsErr<U extends E>(err: U): this is Result<U, T> {
    return this.error === err;
  }

  flatten (): FlattenResult<E, T> {
    return this as unknown as FlattenResult<E, T>;
  }
}

export const Ok = <E, T>(value: T): Result<E, T> => new _Ok(value);

export const Err = <E, T>(error: E): Result<E, T> => new _Err(error);
