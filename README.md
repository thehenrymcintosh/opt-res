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

Handle optional data with the Option type, and stop using exceptions by functionally handling errors with the Result type. 
This library is heavily inspired by the excellent types in Rustlang. 


## Maybe Type

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

Panics if the self value equals `None`.

---
### `unwrapOr: (fallback: T) => T`
Returns the contained `Some` value or a provided default.
