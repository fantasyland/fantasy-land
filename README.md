# Fantasy Land Specification

[![Build Status](https://travis-ci.org/fantasyland/fantasy-land.svg?branch=master)](https://travis-ci.org/fantasyland/fantasy-land) [![Join the chat at https://gitter.im/fantasyland/fantasy-land](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/fantasyland/fantasy-land?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

(aka "Algebraic JavaScript Specification")

<img src="logo.png" width="200" height="200" />

This project specifies interoperability of common algebraic
structures:

<pre>
 <a href="#setoid">Setoid</a>   <a href="#emigroupoid">Semigroupoid</a>  <a href="#semigroup">Semigroup</a>   <a href="#foldable">Foldable</a>        <a href="#functor">Functor</a>      <a href="#contravariant">Contravariant</a>  <a href="#filterable">Filterable</a>
(<a href="#equals-method">equals</a>)    (<a href="#compose-method">compose</a>)    (<a href="#concat-method">concat</a>)   (<a href="#reduce-method">reduce</a>)         (<a href="#map-method">map</a>)        (<a href="#contramap-method">contramap</a>)    (<a href="#filter-method">filter</a>)
    |           |           |           \         / | | | | \
    |           |           |            \       /  | | | |  \
    |           |           |             \     /   | | | |   \
    |           |           |              \   /    | | | |    \
    |           |           |               \ /     | | | |     \
   <a href="#ord">Ord</a>      <a href="#category">Category</a>     <a href="#monoid">Monoid</a>         <a href="#traversable">Traversable</a> | | | |      \
  (<a href="#lte-method">lte</a>)       (<a href="#id-method">id</a>)       (<a href="#empty-method">empty</a>)        (<a href="#traverse-method">traverse</a>)  / | | \       \
                            |                      /  | |  \       \
                            |                     /   / \   \       \
                            |             <a href="#profunctor">Profunctor</a> /   \ <a href="#bifunctor">Bifunctor</a> \
                            |              (<a href="#promap-method">promap</a>) /     \ (<a href="#bimap-method">bimap</a>)   \
                            |                      /       \           \
                          <a href="#group">Group</a>                   /         \           \
                         (<a href="#invert-method">invert</a>)               <a href="#alt">Alt</a>        <a href="#apply">Apply</a>      <a href="#extend">Extend</a>
                                               (<a href="#alt-method">alt</a>)        (<a href="#ap-method">ap</a>)     (<a href="#extend-method">extend</a>)
                                                /           / \           \
                                               /           /   \           \
                                              /           /     \           \
                                             /           /       \           \
                                            /           /         \           \
                                          <a href="#plus">Plus</a>    <a href="#applicative">Applicative</a>    <a href="#chain">Chain</a>      <a href="#comonad">Comonad</a>
                                         (<a href="#zero-method">zero</a>)       (<a href="#of-method">of</a>)      (<a href="#chain-method">chain</a>)    (<a href="#extract-method">extract</a>)
                                            \         / \         / \
                                             \       /   \       /   \
                                              \     /     \     /     \
                                               \   /       \   /       \
                                                \ /         \ /         \
                                            <a href="#alternative">Alternative</a>    <a href="#monad">Monad</a>     <a href="#chainrec">ChainRec</a>
                                                                    (<a href="#chainrec-method">chainRec</a>)
</pre>

## General

An algebra is a set of values, a set of operators that it is closed
under and some laws it must obey.

Each Fantasy Land algebra is a separate specification. An algebra may
have dependencies on other algebras which must be implemented.

## Terminology

1. "value" is any JavaScript value, including any which have the
   structures defined below.
2. "equivalent" is an appropriate definition of equivalence for the given value.
    The definition should ensure that the two values can be safely swapped out in a program that respects abstractions. For example:
    - Two lists are equivalent if they are equivalent at all indices.
    - Two plain old JavaScript objects, interpreted as dictionaries, are equivalent when they are equivalent for all keys.
    - Two promises are equivalent when they yield equivalent values.
    - Two functions are equivalent if they yield equivalent outputs for equivalent inputs.

## Type signature notation

The type signature notation used in this document is described below:<sup
id="sanctuary-types-return">[1](#sanctuary-types)</sup>

* `::` _"is a member of"._
    - `e :: t` can be read as: "the expression `e` is a member of type `t`".
    - `true :: Boolean` - "`true` is a member of type `Boolean`".
    - `42 :: Integer, Number` - "`42` is a member of the `Integer` and
      `Number` types".
* _New types can be created via type constructors._
    - Type constructors can take zero or more type arguments.
    - `Array` is a type constructor which takes one type argument.
    - `Array String` is the type of all arrays of strings. Each of the
      following has type `Array String`: `[]`, `['foo', 'bar', 'baz']`.
    - `Array (Array String)` is the type of all arrays of arrays of strings.
      Each of the following has type `Array (Array String)`: `[]`, `[ [], []
      ]`, `[ [], ['foo'], ['bar', 'baz'] ]`.
* _Lowercase letters stand for type variables._
    - Type variables can take any type unless they have been restricted by
      means of type constraints (see fat arrow below).
* `->` (arrow) _Function type constructor._
    - `->` is an _infix_ type constructor that takes two type arguments where
      left argument is the input type and the right argument is the output type.
    - `->`'s input type can be a grouping of types to create the type of a
      function which accepts zero or more arguments. The syntax is:
      `(<input-types>) -> <output-type>`, where `<input-types>` comprises zero
      or more comma–space (`, `)-separated type representations and parens
      may be omitted for unary functions.
    - `String -> Array String` is a type satisfied by functions which take a
      `String` and return an `Array String`.
    - `String -> Array String -> Array String` is a type satisfied by functions
      which take a `String` and return a function which takes an `Array String`
      and returns an `Array String`.
    - `(String, Array String) -> Array String` is a type satisfied by functions
      which take a `String` and an `Array String` as arguments and return an
      `Array String`.
    - `() -> Number` is a type satisfied by functions
      which do not take arguments and return a `Number`.
* `~>` (squiggly arrow) _Method type constructor._
    - When a function is a property of an Object, it is called a method. All
      methods have an implicit parameter type - the type of which they are a
      property.
    - `a ~> a -> a` is a type satisfied by methods on Objects of type `a` which
      take a type `a` as an argument and return a value of type `a`.
* `=>` (fat arrow) _Expresses constraints on type variables._
    - In `a ~> a -> a` (see squiggly arrow above), `a` can be of any type.
      `Semigroup a => a ~> a -> a` adds a constraint such that the type `a`
      must now satisfy the `Semigroup` typeclass. To satisfy a typeclass means
      to lawfully implement all functions/methods specified by that typeclass.

For example:

```
fantasy-land/traverse :: Applicative f, Traversable t => t a ~> (TypeRep f, a -> f b) -> f (t b)
'-------------------'    '--------------------------'    '-'    '-------------------'    '-----'
 '                        '                               '      '                        '
 '                        ' - type constraints            '      ' - argument types       ' - return type
 '                                                        '
 '- method name                                           ' - method target type
```

- - -
1. <a name="sanctuary-types"></a>See the [Types](https://sanctuary.js.org/#types)
   section in Sanctuary's docs for more info. [↩](#sanctuary-types-return)

## Type representatives

Certain behaviours are defined from the perspective of a member of a type.
Other behaviours do not require a member. Thus certain algebras require a
type to provide a value-level representative (with certain properties). The
Identity type, for example, could provide `Id` as its type representative:
`Id :: TypeRep Identity`.

If a type provides a type representative, each member of the type must have
a `constructor` property which is a reference to the type representative.

## Algebras

### Setoid

1. `a['fantasy-land/equals'](a) === true` (reflexivity)
2. `a['fantasy-land/equals'](b) === b['fantasy-land/equals'](a)` (symmetry)
3. If `a['fantasy-land/equals'](b)` and `b['fantasy-land/equals'](c)`, then `a['fantasy-land/equals'](c)` (transitivity)

<a name="equals-method"></a>

#### `fantasy-land/equals` method

```hs
fantasy-land/equals :: Setoid a => a ~> a -> Boolean
```

A value which has a Setoid must provide a `fantasy-land/equals` method. The
`fantasy-land/equals` method takes one argument:

    a['fantasy-land/equals'](b)

1. `b` must be a value of the same Setoid

    1. If `b` is not the same Setoid, behaviour of `fantasy-land/equals` is
       unspecified (returning `false` is recommended).

2. `fantasy-land/equals` must return a boolean (`true` or `false`).

### Ord

A value that implements the Ord specification must also implement
the [Setoid](#setoid) specification.

1. `a['fantasy-land/lte'](b)` or `b['fantasy-land/lte'](a)` (totality)
2. If `a['fantasy-land/lte'](b)` and `b['fantasy-land/lte'](a)`, then `a['fantasy-land/equals'](b)` (antisymmetry)
3. If `a['fantasy-land/lte'](b)` and `b['fantasy-land/lte'](c)`, then `a['fantasy-land/lte'](c)` (transitivity)

<a name="lte-method"></a>

#### `fantasy-land/lte` method

```hs
fantasy-land/lte :: Ord a => a ~> a -> Boolean
```

A value which has an Ord must provide a `fantasy-land/lte` method. The
`fantasy-land/lte` method takes one argument:

     a['fantasy-land/lte'](b)

1. `b` must be a value of the same Ord

    1. If `b` is not the same Ord, behaviour of `fantasy-land/lte` is
       unspecified (returning `false` is recommended).

2. `fantasy-land/lte` must return a boolean (`true` or `false`).

### Semigroupoid

1. `a['fantasy-land/compose'](b)['fantasy-land/compose'](c) === a['fantasy-land/compose'](b['fantasy-land/compose'](c))` (associativity)

<a name="compose-method"></a>

#### `fantasy-land/compose` method

```hs
fantasy-land/compose :: Semigroupoid c => c i j ~> c j k -> c i k
```

A value which has a Semigroupoid must provide a `fantasy-land/compose` method. The
`fantasy-land/compose` method takes one argument:

    a['fantasy-land/compose'](b)

1. `b` must be a value of the same Semigroupoid

    1. If `b` is not the same semigroupoid, behaviour of `fantasy-land/compose` is
       unspecified.

2. `fantasy-land/compose` must return a value of the same Semigroupoid.

### Category

A value that implements the Category specification must also implement
the [Semigroupoid](#semigroupoid) specification.

1. `a['fantasy-land/compose'](C['fantasy-land/id']())` is equivalent to `a` (right identity)
2. `C['fantasy-land/id']()['fantasy-land/compose'](a)` is equivalent to `a` (left identity)

<a name="id-method"></a>

#### `fantasy-land/id` method

```hs
fantasy-land/id :: Category c => () -> c a a
```

A value which has a Category must provide a `fantasy-land/id` function on its
[type representative](#type-representatives):

    C['fantasy-land/id']()

Given a value `c`, one can access its type representative via the
`constructor` property:

    c.constructor['fantasy-land/id']()

1. `fantasy-land/id` must return a value of the same Category

### Semigroup

1. `a['fantasy-land/concat'](b)['fantasy-land/concat'](c)` is equivalent to `a['fantasy-land/concat'](b['fantasy-land/concat'](c))` (associativity)

<a name="concat-method"></a>

#### `fantasy-land/concat` method

```hs
fantasy-land/concat :: Semigroup a => a ~> a -> a
```

A value which has a Semigroup must provide a `fantasy-land/concat` method. The
`fantasy-land/concat` method takes one argument:

    s['fantasy-land/concat'](b)

1. `b` must be a value of the same Semigroup

    1. If `b` is not the same semigroup, behaviour of `fantasy-land/concat` is
       unspecified.

2. `fantasy-land/concat` must return a value of the same Semigroup.

### Monoid

A value that implements the Monoid specification must also implement
the [Semigroup](#semigroup) specification.

1. `m['fantasy-land/concat'](M['fantasy-land/empty']())` is equivalent to `m` (right identity)
2. `M['fantasy-land/empty']()['fantasy-land/concat'](m)` is equivalent to `m` (left identity)

<a name="empty-method"></a>

#### `fantasy-land/empty` method

```hs
fantasy-land/empty :: Monoid m => () -> m
```

A value which has a Monoid must provide a `fantasy-land/empty` function on its
[type representative](#type-representatives):

    M['fantasy-land/empty']()

Given a value `m`, one can access its type representative via the
`constructor` property:

    m.constructor['fantasy-land/empty']()

1. `fantasy-land/empty` must return a value of the same Monoid

### Group

A value that implements the Group specification must also implement
the [Monoid](#monoid) specification.

1. `g['fantasy-land/concat'](g['fantasy-land/invert']())` is equivalent to `g.constructor['fantasy-land/empty']()` (right inverse)
2. `g['fantasy-land/invert']()['fantasy-land/concat'](g)` is equivalent to `g.constructor['fantasy-land/empty']()` (left inverse)

<a name="invert-method"></a>

#### `fantasy-land/invert` method

```hs
fantasy-land/invert :: Group g => g ~> () -> g
```

A value which has a Group must provide a `fantasy-land/invert` method. The
`fantasy-land/invert` method takes no arguments:

    g['fantasy-land/invert']()

1. `fantasy-land/invert` must return a value of the same Group.

### Filterable

1. `v['fantasy-land/filter'](x => p(x) && q(x))` is equivalent to `v['fantasy-land/filter'](p)['fantasy-land/filter'](q)` (distributivity)
2. `v['fantasy-land/filter'](x => true)` is equivalent to `v` (identity)
3. `v['fantasy-land/filter'](x => false)` is equivalent to `w['fantasy-land/filter'](x => false)`
   if `v` and `w` are values of the same Filterable (annihilation)

<a name="filter-method"></a>

#### `fantasy-land/filter` method

```hs
fantasy-land/filter :: Filterable f => f a ~> (a -> Boolean) -> f a
```

A value which has a Filterable must provide a `fantasy-land/filter` method. The `fantasy-land/filter`
method takes one argument:

    v['fantasy-land/filter'](p)

1. `p` must be a function.

    1. If `p` is not a function, the behaviour of `fantasy-land/filter` is unspecified.
    2. `p` must return either `true` or `false`. If it returns any other value,
       the behaviour of `fantasy-land/filter` is unspecified.

2. `fantasy-land/filter` must return a value of the same Filterable.

### Functor

1. `u['fantasy-land/map'](a => a)` is equivalent to `u` (identity)
2. `u['fantasy-land/map'](x => f(g(x)))` is equivalent to `u['fantasy-land/map'](g)['fantasy-land/map'](f)` (composition)

<a name="map-method"></a>

#### `fantasy-land/map` method

```hs
fantasy-land/map :: Functor f => f a ~> (a -> b) -> f b
```

A value which has a Functor must provide a `fantasy-land/map` method. The `fantasy-land/map`
method takes one argument:

    u['fantasy-land/map'](f)

1. `f` must be a function,

    1. If `f` is not a function, the behaviour of `fantasy-land/map` is
       unspecified.
    2. `f` can return any value.
    3. No parts of `f`'s return value should be checked.

2. `fantasy-land/map` must return a value of the same Functor

### Contravariant

1. `u['fantasy-land/contramap'](a => a)` is equivalent to `u` (identity)
2. `u['fantasy-land/contramap'](x => f(g(x)))` is equivalent to `u['fantasy-land/contramap'](f)['fantasy-land/contramap'](g)`
(composition)

<a name="contramap-method"></a>

#### `fantasy-land/contramap` method

```hs
fantasy-land/contramap :: Contravariant f => f a ~> (b -> a) -> f b
```

A value which has a Contravariant must provide a `fantasy-land/contramap` method. The
`fantasy-land/contramap` method takes one argument:

    u['fantasy-land/contramap'](f)

1. `f` must be a function,

    1. If `f` is not a function, the behaviour of `fantasy-land/contramap` is
       unspecified.
    2. `f` can return any value.
    3. No parts of `f`'s return value should be checked.

2. `fantasy-land/contramap` must return a value of the same Contravariant

### Apply

A value that implements the Apply specification must also
implement the [Functor](#functor) specification.

1. `v['fantasy-land/ap'](u['fantasy-land/ap'](a['fantasy-land/map'](f => g => x => f(g(x)))))` is equivalent to `v['fantasy-land/ap'](u)['fantasy-land/ap'](a)` (composition)

<a name="ap-method"></a>

#### `fantasy-land/ap` method

```hs
fantasy-land/ap :: Apply f => f a ~> f (a -> b) -> f b
```

A value which has an Apply must provide a `fantasy-land/ap` method. The `fantasy-land/ap`
method takes one argument:

    a['fantasy-land/ap'](b)

1. `b` must be an Apply of a function

    1. If `b` does not represent a function, the behaviour of `fantasy-land/ap` is
       unspecified.
    2. `b` must be same Apply as `a`.

2. `a` must be an Apply of any value

3. `fantasy-land/ap` must apply the function in Apply `b` to the value in
   Apply `a`

   1. No parts of return value of that function should be checked.

4. The `Apply` returned by `fantasy-land/ap` must be the same as `a` and `b`

### Applicative

A value that implements the Applicative specification must also
implement the [Apply](#apply) specification.

1. `v['fantasy-land/ap'](A['fantasy-land/of'](x => x))` is equivalent to `v` (identity)
2. `A['fantasy-land/of'](x)['fantasy-land/ap'](A['fantasy-land/of'](f))` is equivalent to `A['fantasy-land/of'](f(x))` (homomorphism)
3. `A['fantasy-land/of'](y)['fantasy-land/ap'](u)` is equivalent to `u['fantasy-land/ap'](A['fantasy-land/of'](f => f(y)))` (interchange)

<a name="of-method"></a>

#### `fantasy-land/of` method

```hs
fantasy-land/of :: Applicative f => a -> f a
```

A value which has an Applicative must provide a `fantasy-land/of` function on its
[type representative](#type-representatives). The `fantasy-land/of` function takes
one argument:

    F['fantasy-land/of'](a)

Given a value `f`, one can access its type representative via the
`constructor` property:

    f.constructor['fantasy-land/of'](a)

1. `fantasy-land/of` must provide a value of the same Applicative

    1. No parts of `a` should be checked

### Alt

A value that implements the Alt specification must also implement
the [Functor](#functor) specification.

1. `a['fantasy-land/alt'](b)['fantasy-land/alt'](c)` is equivalent to `a['fantasy-land/alt'](b['fantasy-land/alt'](c))` (associativity)
2. `a['fantasy-land/alt'](b)['fantasy-land/map'](f)` is equivalent to `a['fantasy-land/map'](f)['fantasy-land/alt'](b['fantasy-land/map'](f))` (distributivity)

<a name="alt-method"></a>

#### `fantasy-land/alt` method

```hs
fantasy-land/alt :: Alt f => f a ~> f a -> f a
```

A value which has a Alt must provide a `fantasy-land/alt` method. The
`fantasy-land/alt` method takes one argument:

    a['fantasy-land/alt'](b)

1. `b` must be a value of the same Alt

    1. If `b` is not the same Alt, behaviour of `fantasy-land/alt` is
       unspecified.
    2. `a` and `b` can contain any value of same type.
    3. No parts of `a`'s and `b`'s containing value should be checked.

2. `fantasy-land/alt` must return a value of the same Alt.

### Plus

A value that implements the Plus specification must also implement
the [Alt](#alt) specification.

1. `x['fantasy-land/alt'](A['fantasy-land/zero']())` is equivalent to `x` (right identity)
2. `A['fantasy-land/zero']()['fantasy-land/alt'](x)` is equivalent to `x` (left identity)
3. `A['fantasy-land/zero']()['fantasy-land/map'](f)` is equivalent to `A['fantasy-land/zero']()` (annihilation)

<a name="zero-method"></a>

#### `fantasy-land/zero` method

```hs
fantasy-land/zero :: Plus f => () -> f a
```

A value which has a Plus must provide a `fantasy-land/zero` function on its
[type representative](#type-representatives):

    A['fantasy-land/zero']()

Given a value `x`, one can access its type representative via the
`constructor` property:

    x.constructor['fantasy-land/zero']()

1. `fantasy-land/zero` must return a value of the same Plus

### Alternative

A value that implements the Alternative specification must also implement
the [Applicative](#applicative) and [Plus](#plus) specifications.

1. `x['fantasy-land/ap'](f['fantasy-land/alt'](g))` is equivalent to `x['fantasy-land/ap'](f)['fantasy-land/alt'](x['fantasy-land/ap'](g))` (distributivity)
2. `x['fantasy-land/ap'](A['fantasy-land/zero']())` is equivalent to `A['fantasy-land/zero']()` (annihilation)

### Foldable

1. `u['fantasy-land/reduce']` is equivalent to `u['fantasy-land/reduce']((acc, x) => acc.concat([x]), []).reduce`

<a name="reduce-method"></a>

#### `fantasy-land/reduce` method

```hs
fantasy-land/reduce :: Foldable f => f a ~> ((b, a) -> b, b) -> b
```

A value which has a Foldable must provide a `fantasy-land/reduce` method. The `fantasy-land/reduce`
method takes two arguments:

    u['fantasy-land/reduce'](f, x)

1. `f` must be a binary function

    1. if `f` is not a function, the behaviour of `fantasy-land/reduce` is unspecified.
    2. The first argument to `f` must be the same type as `x`.
    3. `f` must return a value of the same type as `x`.
    4. No parts of `f`'s return value should be checked.

1. `x` is the initial accumulator value for the reduction

    1. No parts of `x` should be checked.

### Traversable

A value that implements the Traversable specification must also
implement the [Functor](#functor) and [Foldable](#foldable) specifications.

1. `t(u['fantasy-land/traverse'](F, x => x))` is equivalent to `u['fantasy-land/traverse'](G, t)` for any
   `t` such that `t(a)['fantasy-land/map'](f)` is equivalent to `t(a['fantasy-land/map'](f))` (naturality)

2. `u['fantasy-land/traverse'](F, F['fantasy-land/of'])` is equivalent to `F['fantasy-land/of'](u)` for any Applicative `F`
   (identity)

3. `u['fantasy-land/traverse'](Compose, x => new Compose(x))` is equivalent to
   `new Compose(u['fantasy-land/traverse'](F, x => x)['fantasy-land/map'](x => x['fantasy-land/traverse'](G, x => x)))` for
   `Compose` defined below and any Applicatives `F` and `G` (composition)

```js
function Compose(c) {
  this.c = c;
}

Compose['fantasy-land/of'] = function(x) {
  return new Compose(F['fantasy-land/of'](G['fantasy-land/of'](x)));
};

Compose.prototype['fantasy-land/ap'] = function(f) {
  return new Compose(this.c['fantasy-land/ap'](f.c['fantasy-land/map'](u => y => y['fantasy-land/ap'](u))));
};

Compose.prototype['fantasy-land/map'] = function(f) {
  return new Compose(this.c['fantasy-land/map'](y => y['fantasy-land/map'](f)));
};
```

<a name="traverse-method"></a>

#### `fantasy-land/traverse` method

```hs
fantasy-land/traverse :: Applicative f, Traversable t => t a ~> (TypeRep f, a -> f b) -> f (t b)
```

A value which has a Traversable must provide a `fantasy-land/traverse` method. The `fantasy-land/traverse`
method takes two arguments:

    u['fantasy-land/traverse'](A, f)

1. `A` must be the [type representative](#type-representatives) of an
   Applicative.

2. `f` must be a function which returns a value

    1. If `f` is not a function, the behaviour of `fantasy-land/traverse` is
       unspecified.
    2. `f` must return a value of the type represented by `A`.

3. `fantasy-land/traverse` must return a value of the type represented by `A`.

### Chain

A value that implements the Chain specification must also
implement the [Apply](#apply) specification.

1. `m['fantasy-land/chain'](f)['fantasy-land/chain'](g)` is equivalent to `m['fantasy-land/chain'](x => f(x)['fantasy-land/chain'](g))` (associativity)

<a name="chain-method"></a>

#### `fantasy-land/chain` method

```hs
fantasy-land/chain :: Chain m => m a ~> (a -> m b) -> m b
```

A value which has a Chain must provide a `fantasy-land/chain` method. The `fantasy-land/chain`
method takes one argument:

    m['fantasy-land/chain'](f)

1. `f` must be a function which returns a value

    1. If `f` is not a function, the behaviour of `fantasy-land/chain` is
       unspecified.
    2. `f` must return a value of the same Chain

2. `fantasy-land/chain` must return a value of the same Chain

### ChainRec

A value that implements the ChainRec specification must also implement the [Chain](#chain) specification.

1. `M['fantasy-land/chainRec']((next, done, v) => p(v) ? d(v)['fantasy-land/map'](done) : n(v)['fantasy-land/map'](next), i)`
   is equivalent to
   `(function step(v) { return p(v) ? d(v) : n(v)['fantasy-land/chain'](step); }(i))` (equivalence)
2. Stack usage of `M['fantasy-land/chainRec'](f, i)` must be at most a constant multiple of the stack usage of `f` itself.

<a name="chainRec-method"></a>

#### `fantasy-land/chainRec` method

```hs
fantasy-land/chainRec :: ChainRec m => ((a -> c, b -> c, a) -> m c, a) -> m b
```

A Type which has a ChainRec must provide a `fantasy-land/chainRec` function on its
[type representative](#type-representatives). The `fantasy-land/chainRec` function
takes two arguments:

    M['fantasy-land/chainRec'](f, i)

Given a value `m`, one can access its type representative via the
`constructor` property:

    m.constructor['fantasy-land/chainRec'](f, i)

1. `f` must be a function which returns a value
    1. If `f` is not a function, the behaviour of `fantasy-land/chainRec` is unspecified.
    2. `f` takes three arguments `next`, `done`, `value`
        1. `next` is a function which takes one argument of same type as `i` and can return any value
        2. `done` is a function which takes one argument and returns the same type as the return value of `next`
        3. `value` is some value of the same type as `i`
    3. `f` must return a value of the same ChainRec which contains a value returned from either `done` or `next`
2. `fantasy-land/chainRec` must return a value of the same ChainRec which contains a value of same type as argument of `done`

### Monad

A value that implements the Monad specification must also implement
the [Applicative](#applicative) and [Chain](#chain) specifications.

1. `M['fantasy-land/of'](a)['fantasy-land/chain'](f)` is equivalent to `f(a)` (left identity)
2. `m['fantasy-land/chain'](M['fantasy-land/of'])` is equivalent to `m` (right identity)

### Extend

A value that implements the Extend specification must also implement the [Functor](#functor) specification.

1. `w['fantasy-land/extend'](g)['fantasy-land/extend'](f)` is equivalent to `w['fantasy-land/extend'](_w => f(_w['fantasy-land/extend'](g)))`

<a name="extend-method"></a>

#### `fantasy-land/extend` method

```hs
fantasy-land/extend :: Extend w => w a ~> (w a -> b) -> w b
```

An Extend must provide a `fantasy-land/extend` method. The `fantasy-land/extend`
method takes one argument:

     w['fantasy-land/extend'](f)

1. `f` must be a function which returns a value

    1. If `f` is not a function, the behaviour of `fantasy-land/extend` is
       unspecified.
    2. `f` must return a value of type `v`, for some variable `v` contained in `w`.
    3. No parts of `f`'s return value should be checked.

2. `fantasy-land/extend` must return a value of the same Extend.

### Comonad

A value that implements the Comonad specification must also implement the [Extend](#extend) specification.

1. `w['fantasy-land/extend'](_w => _w['fantasy-land/extract']())` is equivalent to `w` (left identity)
2. `w['fantasy-land/extend'](f)['fantasy-land/extract']()` is equivalent to `f(w)` (right identity)

<a name="extract-method"></a>

#### `fantasy-land/extract` method

```hs
fantasy-land/extract :: Comonad w => w a ~> () -> a
```

A value which has a Comonad must provide a `fantasy-land/extract` method on itself.
The `fantasy-land/extract` method takes no arguments:

    w['fantasy-land/extract']()

1. `fantasy-land/extract` must return a value of type `v`, for some variable `v` contained in `w`.
    1. `v` must have the same type that `f` returns in `fantasy-land/extend`.

### Bifunctor

A value that implements the Bifunctor specification must also implement
the [Functor](#functor) specification.

1. `p['fantasy-land/bimap'](a => a, b => b)` is equivalent to `p` (identity)
2. `p['fantasy-land/bimap'](a => f(g(a)), b => h(i(b))` is equivalent to `p['fantasy-land/bimap'](g, i)['fantasy-land/bimap'](f, h)` (composition)

<a name="bimap-method"></a>

#### `fantasy-land/bimap` method

```hs
fantasy-land/bimap :: Bifunctor f => f a c ~> (a -> b, c -> d) -> f b d
```

A value which has a Bifunctor must provide a `fantasy-land/bimap` method. The `fantasy-land/bimap`
method takes two arguments:

    c['fantasy-land/bimap'](f, g)

1. `f` must be a function which returns a value

    1. If `f` is not a function, the behaviour of `fantasy-land/bimap` is unspecified.
    2. `f` can return any value.
    3. No parts of `f`'s return value should be checked.

2. `g` must be a function which returns a value

    1. If `g` is not a function, the behaviour of `fantasy-land/bimap` is unspecified.
    2. `g` can return any value.
    3. No parts of `g`'s return value should be checked.

3. `fantasy-land/bimap` must return a value of the same Bifunctor.

### Profunctor

A value that implements the Profunctor specification must also implement
the [Functor](#functor) specification.

1. `p['fantasy-land/promap'](a => a, b => b)` is equivalent to `p` (identity)
2. `p['fantasy-land/promap'](a => f(g(a)), b => h(i(b)))` is equivalent to `p['fantasy-land/promap'](f, i)['fantasy-land/promap'](g, h)` (composition)

<a name="promap-method"></a>

#### `fantasy-land/promap` method

```hs
fantasy-land/promap :: Profunctor p => p b c ~> (a -> b, c -> d) -> p a d
```

A value which has a Profunctor must provide a `fantasy-land/promap` method.

The `fantasy-land/promap` method takes two arguments:

    c['fantasy-land/promap'](f, g)

1. `f` must be a function which returns a value

    1. If `f` is not a function, the behaviour of `fantasy-land/promap` is unspecified.
    2. `f` can return any value.
    3. No parts of `f`'s return value should be checked.

2. `g` must be a function which returns a value

    1. If `g` is not a function, the behaviour of `fantasy-land/promap` is unspecified.
    2. `g` can return any value.
    3. No parts of `g`'s return value should be checked.

3. `fantasy-land/promap` must return a value of the same Profunctor

## Derivations

When creating data types which satisfy multiple algebras, authors may choose
to implement certain methods then derive the remaining methods. Derivations:

  - [`fantasy-land/equals`][] may be derived from [`fantasy-land/lte`][]:

    ```js
    function equals(other) { return this['fantasy-land/lte'](other) && other['fantasy-land/lte'](this); }
    ```

  - [`fantasy-land/map`][] may be derived from [`fantasy-land/ap`][] and [`fantasy-land/of`][]:

    ```js
    function map(f) { return this['fantasy-land/ap'](this.constructor['fantasy-land/of'](f)); }
    ```

  - [`fantasy-land/map`][] may be derived from [`fantasy-land/chain`][] and [`fantasy-land/of`][]:

    ```js
    function map(f) { return this['fantasy-land/chain'](a => this.constructor['fantasy-land/of'](f(a))); }
    ```

  - [`fantasy-land/map`][] may be derived from [`fantasy-land/bimap`][]:

    ```js
    function map(f) { return this['fantasy-land/bimap'](a => a, f); }
    ```

  - [`fantasy-land/map`][] may be derived from [`fantasy-land/promap`][]:

    ```js
    function map(f) { return this['fantasy-land/promap'](a => a, f); }
    ```

  - [`fantasy-land/ap`][] may be derived from [`fantasy-land/chain`][]:

    ```js
    function ap(m) { return m['fantasy-land/chain'](f => this['fantasy-land/map'](f)); }
    ```

  - [`fantasy-land/reduce`][] may be derived as follows:

    ```js
    function reduce(f, acc) {
      function Const(value) {
        this.value = value;
      }
      Const['fantasy-land/of'] = function(_) {
        return new Const(acc);
      };
      Const.prototype['fantasy-land/map'] = function(_) {
        return this;
      };
      Const.prototype['fantasy-land/ap'] = function(b) {
        return new Const(f(b.value, this.value));
      };
      return this['fantasy-land/traverse'](x => new Const(x), Const['fantasy-land/of']).value;
    }
    ```

  - [`fantasy-land/map`][] may be derived as follows:

    ```js
    function map(f) {
      function Id(value) {
        this.value = value;
      }
      Id['fantasy-land/of'] = function(x) {
        return new Id(x);
      };
      Id.prototype['fantasy-land/map'] = function(f) {
        return new Id(f(this.value));
      };
      Id.prototype['fantasy-land/ap'] = function(b) {
        return new Id(this.value(b.value));
      };
      return this['fantasy-land/traverse'](x => Id['fantasy-land/of'](f(x)), Id['fantasy-land/of']).value;
    }
    ```

  - [`fantasy-land/filter`][] may be derived from [`fantasy-land/of`][], [`fantasy-land/chain`][], and [`fantasy-land/zero`][]:

    ```js
    function filter(pred) {
      var F = this.constructor;
      return this['fantasy-land/chain'](x => pred(x) ? F['fantasy-land/of'](x) : F['fantasy-land/zero']());
    }
    ```

  - [`fantasy-land/filter`][] may be derived from [`fantasy-land/concat`][], [`fantasy-land/of`][], [`fantasy-land/zero`][], and
    [`fantasy-land/reduce`][]:

    ```js
    function filter(pred) {
      var F = this.constructor;
      return this['fantasy-land/reduce']((f, x) => pred(x) ? f['fantasy-land/concat'](F['fantasy-land/of'](x)) : f, F['fantasy-land/zero']());
    }
    ```

If a data type provides a method which *could* be derived, its behaviour must
be equivalent to that of the derivation (or derivations).

## Notes

1. If there's more than a single way to implement the methods and
   laws, the implementation should choose one and provide wrappers for
   other uses.
2. It's discouraged to overload the specified methods. It can easily
   result in broken and buggy behaviour.
3. It is recommended to throw an exception on unspecified behaviour.
4. An `Identity` container which implements many of the methods is provided by
   [sanctuary-identity](https://github.com/sanctuary-js/sanctuary-identity).


[`fantasy-land/ap`]: #ap-method
[`fantasy-land/bimap`]: #bimap-method
[`fantasy-land/chain`]: #chain-method
[`fantasy-land/concat`]: #concat-method
[`fantasy-land/equals`]: #equals-method
[`fantasy-land/filter`]: #filter-method
[`fantasy-land/lte`]: #lte-method
[`fantasy-land/map`]: #map-method
[`fantasy-land/of`]: #of-method
[`fantasy-land/promap`]: #promap-method
[`fantasy-land/reduce`]: #reduce-method
[`fantasy-land/zero`]: #zero-method

## Alternatives

There also exists [Static Land Specification](https://github.com/rpominov/static-land)
with exactly the same ideas as Fantasy Land but based on static methods instead of instance methods.
