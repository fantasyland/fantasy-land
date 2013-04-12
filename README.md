# Fantasy Land Specification

(aka "Algebraic JavaScript Specification")

![](logo.png)

This project specifies interoperability of common algebraic
structures:

* Functor
* Monad

## General

An algebra is a set of values, a set of operators that it is closed
under and some laws it must obey.

## Terminology

1. "value" is any JavaScript value, including any which have the
   structures defined below.

## Algebras

### Functor

1. `u.map(function(a) { return a; }))` equals `u`
2. `u.map(function(x) { return f(g(x)); })` equals `u.map(g).map(f)`

#### `map` method

A value which has a functor must provide a `map` method. The `map`
method takes one argument:

    u.map(f)

1. `f` must be a function,

    1. If `f` is not a function, the behaviour of `map` is
       unspecified.
    2. `f` can return any value.

2. `map` must return a value of the same functor

### Monad

A value which satisfies the specification of a monad do not need to implement:

* Functor's `map`; derivable as `function(f) { var m = this; return
  m.then(function(a) { return m.constructor.of(f(a)); })}`

1. `of(a).then(f)` equals `f(a)`
2. `m.then(of)` equals `m`
3. `m.then(f).then(g)` equals `m.then(function(x) { return f(x).then(g); })`

#### `then` method

A value which has a monad must provide a `then` method. The `then`
method takes one argument:

    m.then(f)

1. `f` must be a function which returns a value

    1. If `f` is not a function, the behaviour of `then` is
       unspecified.
    2. `f` must return a value of the same monad

2. `then` must return a value of the same monad

#### `constructor.of` method

A value which has a monad must provide a `constructor` object. The
`constructor` object must have an `of` method which takes one
argument:

    m.constructor.of(a)

1. `of` must provide a value of the same monad

    1. No parts of `a` should be checked

## Notes

1. It's discouraged to overload the specified methods. It can easily
   result in broken and buggy behaviour.
2. It is recommended to throw an exception on unspecified behaviour.
3. An `Id` container which implements all methods is provided in
   `id.js`.
