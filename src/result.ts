import { None, Option, Some } from './option';

type map<I, O> = (arg: I) => O;

type FlattenResult<E, T> = T extends Result<(infer E2), (infer T2)> ? Result<E2, T2> : Result<E, T>;

export interface Result<E, T> {
  and: (result: Result<E, T>) => Result<E, T>
  andThen: <T2>(map: map<T, Result<E, T2>>) => Result<E, T2>
  contains: <T2 extends T>(value: T2) => this is Result<E, T2>
  containsErr: <E2 extends E>(err: E2) => this is Result<E2, T>
  err: () => Option<E>
  flatten: () => FlattenResult<E, T>
  isErr: () => this is _Err<E, T>
  isOk: () => this is _Ok<E, T>
  iter: () => T[]
  map: <T2>(map: map<T, T2>) => Result<E, T2>
  mapErr: <E2>(map: map<E, E2>) => Result<E2, T>
  ok: () => Option<T>
  or: (result: Result<E, T>) => Result<E, T>
  orElse: (map: map<E, Result<E, T>>) => Result<E, T>
  reduce: <O>(errMap: map<E, O>, map: map<T, O>) => O
  unwrap: () => T
  unwrapErr: () => E
  unwrapOr: (arg: T) => T
  unwrapOrElse: (map: map<E, T>) => T
}

class _Ok<E, T> implements Result<E, T> {
  constructor (private readonly value: T) {}

  and (result: Result<E, T>): Result<E, T> {
    return result;
  }

  andThen<U>(map: map<T, Result<E, U>>): Result<E, U> {
    return map(this.value);
  }

  contains<U extends T>(value: U): this is Result<E, U> {
    return this.value === value;
  }

  containsErr<U extends E>(): this is Result<U, T> {
    return false;
  }

  err (): Option<E> {
    return None();
  }

  flatten (): FlattenResult<E, T> {
    if (this.value instanceof _Ok) return this.value as unknown as FlattenResult<E, T>;
    if (this.value instanceof _Err) return this.value as unknown as FlattenResult<E, T>;
    return this as unknown as FlattenResult<E, T>;
  }

  isErr (): this is _Err<E, T> {
    return false;
  }

  isOk (): this is _Ok<E, T> {
    return true;
  }

  iter (): T[] {
    return [this.value];
  }

  map<T2>(map: map<T, T2>): Result<E, T2> {
    return new _Ok(map(this.value));
  }

  mapErr<E2>(): Result<E2, T> {
    return this as unknown as Result<E2, T>;
  }

  ok (): Option<T> {
    return Some(this.value);
  }

  or (): Result<E, T> {
    return this;
  }

  orElse (): Result<E, T> {
    return this;
  }

  reduce<U>(_errMap: map<E, U>, map: map<T, U>): U {
    return map(this.value);
  }

  unwrap (): T {
    return this.value;
  }

  unwrapErr (): E {
    throw new Error('Tried to unwrapErr an Ok!');
  }

  unwrapOr (): T {
    return this.value;
  }

  unwrapOrElse (): T {
    return this.value;
  }
}

class _Err<E, T> implements Result<E, T> {
  // eslint-disable-next-line n/handle-callback-err
  constructor (private readonly error: E) {}

  and (): Result<E, T> {
    return this;
  }

  andThen<U>(): Result<E, U> {
    return this as unknown as Result<E, U>;
  }

  contains<U extends T>(): this is Result<E, U> {
    return false;
  }

  containsErr<U extends E>(err: U): this is Result<U, T> {
    return this.error === err;
  }

  err (): Option<E> {
    return Some(this.error);
  }

  flatten (): FlattenResult<E, T> {
    return this as unknown as FlattenResult<E, T>;
  }

  isErr (): this is _Err<E, T> {
    return true;
  }

  isOk (): this is _Ok<E, T> {
    return false;
  }

  iter (): T[] {
    return [];
  }

  map<T2>(): Result<E, T2> {
    return this as unknown as Result<E, T2>;
  }

  mapErr<E2>(map: map<E, E2>): Result<E2, T> {
    return Err(map(this.error));
  }

  ok (): Option<T> {
    return None();
  }

  or (result: Result<E, T>): Result<E, T> {
    return result;
  }

  orElse (map: (error: E) => Result<E, T>): Result<E, T> {
    return map(this.error);
  }

  reduce<U>(errMap: map<E, U>): U {
    return errMap(this.error);
  }

  unwrap (): T {
    throw new Error('Tried to unwrap an Err!');
  }

  unwrapErr (): E {
    return this.error;
  }

  unwrapOr (arg: T): T {
    return arg;
  }

  unwrapOrElse (map: (error: E) => T): T {
    return map(this.error);
  }
}

export const Ok = <E, T>(value: T): Result<E, T> => new _Ok(value);

export const Err = <E, T>(error: E): Result<E, T> => new _Err(error);
