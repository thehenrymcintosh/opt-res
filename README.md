<hr>
<div align="center">
  <h1 align="center">
    opt-res
  </h1>
</div>

<p align="center">
  <a href="https://bundlephobia.com/result?p=opt-res">
    <img alt="Bundlephobia" src="https://img.shields.io/bundlephobia/minzip/opt-res?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="Types" href="https://www.npmjs.com/package/opt-res">
    <img alt="Types" src="https://img.shields.io/npm/types/opt-res?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="NPM version" href="https://www.npmjs.com/package/opt-res">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/opt-res?style=for-the-badge&labelColor=24292e">
  </a>
  <a aria-label="License" href="https://mit-license.org/">
    <img alt="MIT License" src="https://img.shields.io/npm/l/opt-res?style=for-the-badge&labelColor=24292e">
  </a>
</p>

<pre align="center">npm i opt-res</pre>
<hr>

Replace null checks with the Option type, and elegantly handle optional data. 

Replace exceptions with functional error handling using the Result type. 

This library is heavily inspired by the excellent Option and Result enums from Rustlang.

## Maybe

### `and: (optb: Option<T>) => Option<T>`
Returns `None` if the option is `None`, otherwise returns optb.

---

### `andThen: <U>(map: map<T, Option<U>>) => Option<U>`
Returns `None` if the option is `None`, otherwise calls `map` with the wrapped value and returns the result.

---
### `contains: <T2 extends T>(value: T2) => this is Option<T2>`
Returns true if the option is a `Some` value containing the given value. Uses strict equality.

---
### `filter: (filter: filter<T>) => Option<T>`
Returns `None` if the option is `None`, otherwise calls predicate with the wrapped value and returns:

- `Some<T>` if predicate returns true (keeping the wrapped value), and
- `None` if predicate returns false.

This function works similar to filtering an array. You can imagine the `Option<T>` being an iterator over one or zero elements. `filter()` lets you decide which elements to keep.

---
### `flatten: () => FlattenOption<T>`
Converts from `Option<Option<T>>` to `Option<T>`. 

Flattening only removes one level of nesting at a time:

---
### `isNone: () => this is _None<T>`
Returns true if the option is a `None` value.

---
### `isSome: () => this is _Some<T>`
Returns true if the option is a `Some` value.

---
### `isSomeAnd: (condition: filter<T>) => boolean`
Returns true if the option is a `Some` and the value inside matches a predicate.

---
### `iter: () => T[]`
Converts the option to an array

- Array has length 1 and contains inner value if the option is a `Some`.
- Array is empty if the option is a `None` value.

---
### `map: <U>(map: map<T, U>) => Option<U>`
Maps an `Option<T>` to `Option<U>` by applying a function to a contained value.

---
### `okOr: <E>(err: E) => Result<E, T>`
Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some<T>` to `Ok<T>` and `None` to `Err<E>`.

---
### `or: (optb: Option<T>) => Option<T>`
Returns the option if it contains a value, otherwise returns optb.

---
### `unwrap: () => T`
Returns the contained `Some` value, consuming the self value.

Panics if the self value equals `None`. Because this function may panic, its use is generally discouraged.

---
### `unwrapOr: (fallback: T) => T`
Returns the contained `Some` value or a provided default.

---


## Result Type

### `and: (res: Result<E, T>) => Result<E, T>`
Returns res if the result is `Ok`, otherwise returns the `Err` value of self.

---
### `andThen: <T2>(map: map<T, Result<E, T2>>) => Result<E, T2>`
Calls `map` if the result is `Ok`, otherwise returns the `Err` value of self.

---
### `contains: <T2 extends T>(value: T2) => this is Result<E, T2>`
Returns `true` if the result is an `Ok` value containing the given value. Uses strict equals.

---
### `containsErr: <E2 extends E>(err: E2) => this is Result<E2, T>`
Returns `true` if the result is an `Err` value containing the given value. Uses strict equals.

---
### `err: () => Option<E>`
Converts from `Result<E, T>` to `Option<E>`.

---
### `flatten: () => FlattenResult<E, T>`
Converts from `Result<E, Result<E, T>>` to `Result<E, T>`.

---
### `isErr: () => this is _Err<E, T>`
Returns `true` if the result is `Err`.

---
### `isOk: () => this is _Ok<E, T>`
Returns `true` if the result is `Ok`.

---
### `iter: () => T[]`
Converts the result to an array

- Array has length 1 and contains inner value if the result is a `Ok`.
- Array is empty if the result is a `Err` value.

---
### `map: <T2>(map: map<T, T2>) => Result<E, T2>`
Maps a `Result<E, T>` to `Result<E, T2>` by applying a function to a contained `Ok` value, leaving an `Err` value untouched.

---
### `mapErr: <E2>(map: map<E, E2>) => Result<E2, T>`
Maps a `Result<E, T>` to `Result<E2, T>` by applying a function to a contained Err value, leaving an Ok value untouched.

---
### `ok: () => Option<T>`
Converts from `Result<E, T>` to `Option<T>`.

---
### `or: (result: Result<E, T>) => Result<E, T>`
Returns res if the result is `Err`, otherwise returns the `Ok` value of self.

---
### `orElse: (map: map<E, Result<E, T>>) => Result<E, T>`
Calls `map` if the result is `Err`, otherwise returns the `Ok` value of self.

---
### `reduce: <O>(errMap: map<E, O>, map: map<T, O>) => O`
Calls `map` on the inner value of an `Ok`, or `errMap` on the inner value of an `Err`. `map` and `errMap` should produce the same output type.

---
### `unwrap: () => T`
Returns the contained `Ok` value, consuming the self value.

Panics if the self value equals `Err`. Because this function may panic, its use is generally discouraged.

---
### `unwrapErr: () => E`
Returns the contained `Err` value, consuming the self value.

Panics if the self value equals `Ok`. Because this function may panic, its use is generally discouraged.

---
### `unwrapOr: (arg: T) => T`
Returns the contained `Ok` value or a provided default.

---
### `unwrapOrElse: (map: map<E, T>) => T`
Returns the contained `Ok` value or computes it by calling `map` on the inner value of the `Err`.
