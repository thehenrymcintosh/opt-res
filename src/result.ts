import { None, Option, Some } from './option';

type map<I, O> = (arg: I) => O;
type asyncMap<I, O> = (arg: I) => Promise<O> | O;

export interface Result<E, T> {
  isErr: () => this is _Err<E, T>
  isOk: () => this is _Ok<E, T>
  ok: () => Option<T>
  err: () => Option<E>
  map: <U>(map: map<T, U>) => Result<E, U>
  asyncMap: <U>(map: asyncMap<Awaited<T>, U>) => Result<E, Promise<U>>
  unwrap: () => T
  unwrapOr: (arg: T) => T
  unwrapErr: () => E
  andThen: <U>(map: map<T, Result<E, U>>) => Result<E, U>
  resolve: () => Promise<Result<E, Awaited<T>>>
  asyncAndThen: <U>(
    map: asyncMap<Awaited<T>, Result<E, U>>
  ) => Promise<Result<E, U>>
  reduce: <U>(errMap: map<E, U>, map: map<T, U>) => U
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

  asyncMap<U>(map: asyncMap<Awaited<T>, U>): Result<E, Promise<U>> {
    return new _Ok(Promise.resolve(this.value).then(map));
  }

  async asyncAndThen<U>(
    map: asyncMap<Awaited<T>, Result<E, U>>
  ): Promise<Result<E, U>> {
    return await Promise.resolve(this.value).then(map);
  }

  andThen<U>(map: map<T, Result<E, U>>): Result<E, U> {
    return map(this.value);
  }

  async resolve (): Promise<Result<E, Awaited<T>>> {
    const value = await this.value;
    return new _Ok(value);
  }

  reduce<U>(_errMap: map<E, U>, map: map<T, U>): U {
    return map(this.value);
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

  asyncMap<U>(): Result<E, Promise<U>> {
    return this as unknown as Result<E, Promise<U>>;
  }

  andThen<U>(): Result<E, U> {
    return this as unknown as Result<E, U>;
  }

  async asyncAndThen<U>(): Promise<Result<E, U>> {
    return this as unknown as Result<E, U>;
  }

  async resolve (): Promise<Result<E, Awaited<T>>> {
    return this as unknown as Result<E, Awaited<T>>;
  }

  reduce<U>(errMap: map<E, U>): U {
    return errMap(this.error);
  }
}

export const Ok = <E, T>(value: T): Result<E, T> => new _Ok(value);

export const Err = <E, T>(error: E): Result<E, T> => new _Err(error);
