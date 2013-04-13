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
2. "equivalent" is an appropriate definition of equivalence for the given value. 
    The definition should ensure that the two values can be safely swapped out in a program that respects abstractions. For example:
    - Two lists are equivalent if they are equivalent at all indices.
    - Two plain old JavaScript objects, interpreted as dictionaries, are equivalent when they are equivalent for all keys.
    - Two promises are equivalent when they yield equivalent values.
    - Two functions are equivalent if they yield equivalent outputs for equivalent inputs.

## Algebras

### Functor

1. `u.map(function(a) { return a; }))` is equivalent to `u`
2. `u.map(function(x) { return f(g(x)); })` is equivalent to `u.map(g).map(f)`

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

1. `of(a).then(f)` is equivalent to `f(a)`
2. `m.then(of)` is equivalent to `m`
3. `m.then(f).then(g)` is equivalent to `m.then(function(x) { return f(x).then(g); })`

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

1. If there's more than a single way to implement the methods and
   laws, the implementation should choose one and provide wrappers for
   other uses.
2. It's discouraged to overload the specified methods. It can easily
   result in broken and buggy behaviour.
3. It is recommended to throw an exception on unspecified behaviour.
4. An `Id` container which implements all methods is provided in
   `id.js`.
