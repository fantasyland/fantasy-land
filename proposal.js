'use strict';

const assert = require ('assert');

const show = require ('sanctuary-show');


//  # Proposal: Fully-qualified type representatives
//
//  This document describes a proposal for a fundamental change to the
//  Fantasy Land specification. It also serves as a proof of concept.
//
//  ## Motivation
//
//  Thanks to type inference, Haskell expressions are able to evaluate
//  differently in different contexts:
//
//      Prelude> :t mempty
//      mempty :: Monoid a => a
//
//      Prelude> mempty :: String
//      ""
//
//      Prelude> mempty :: [Float]
//      []
//
//      Prelude> mempty :: (String, [Float])
//      ("",[])
//
//  Without type inference, explicit type information is required in order
//  to achieve this in JavaScript. [Type representatives][1] exist for this
//  purpose, giving us the ability to provide a polymorphic `empty` function:
//
//      > S.empty
//      empty :: Monoid a => TypeRep a -> a
//
//      > S.empty (String)
//      ''
//
//      > S.empty (Array)
//      []
//
//  This function, though, cannot be used to create an empty value of type
//  `Pair String (Array Number)`, because type representatives as currently
//  defined provide no information about inner types.
//
//  This proposal makes type representatives as expressive as their (implicit)
//  Haskell counterparts.
//
//  [1]: https://github.com/fantasyland/fantasy-land#type-representatives
//
//  ## Changes
//
//  1.  The `constructor` property would no longer be used to access a
//      value's type representative. A new property name would be chosen.
//
//  2.  Fantasy Land methods would only ever be defined on type representatives
//      (the current specifications requires certain methods to be defined
//      directly on values rather than on their type representatives).
//      Consequently, Fantasy Land method names would no longer be prefixed.
//
//  3.  Fantasy Land methods would be regular functions. They would take
//      all their arguments explicitly. (Farewell squiggly arrow!)
//
//  4.  Fantasy Land methods would be curried. This change is optional,
//      but should be considered given that ADT library authors would need
//      to make significant changes to their libraries regardless.
//
//  5.  The fantasy-land package would export a type representative
//      for each of JavaScript's built-in nullary types (e.g. `Number`),
//      and a type representative constructor for each of JavaScript's
//      built-in parameterized types (e.g. `Array a`). The Fantasy Land
//      implementations for built-in types would be moved to these type
//      representatives from sanctuary-type-classes.
//
//  6.  The fantasy-land package would export a function for accessing a
//      value's type representative.
//
//  7.  The fantasy-land package would export a predicate for each type class,
//      enabling type representative constructors to include conditional logic
//      (see `Maybe._` and `Pair._` below).
//
//  8.  The fantasy-land package would export a function for each method
//      defined in the specification.

const FL = {};

//# FL.Unknown :: TypeRep a
//.
//. The type representative of `Nothing` is `Maybe (Unknown)`. In order for
//. `FL.concat (Nothing) (Nothing)` to work, `Maybe (Unknown)` must satisfy
//. the Semigroup constraint. Thus it is necessary to provide dummy methods
//. (which are never invoked). Without this embryonic behaviour it would be
//. necessary to use `concat (Nothing_ (FL.String)) (Nothing_ (FL.String))`.
FL.Unknown = {
  '@@show': () => 'Unknown',
  'concat': u1 => u2 => { throw new TypeError ('Not implemented'); },
  'empty': () => { throw new TypeError ('Not implemented'); },
};

//# FL.Number :: TypeRep Number
FL.Number = {
  '@@show': () => 'Number',
};

//# FL.String :: TypeRep String
FL.String = {
  '@@show': () => 'String',
  'concat': s1 => s2 => s1 + s2,
  'empty': () => '',
};

//# FL.Array :: TypeRep a -> TypeRep (Array a)
FL.Array = $1 => ({
  '@@show': () => 'Array (' + show ($1) + ')',
  'concat': a1 => a2 => a1.concat (a2),
  'empty': () => [],
});

//# FL.typeRep :: a -> TypeRep a
//.
//. Returns the given value's type representative.
FL.typeRep = function typeRep(x) {
  switch (Object.prototype.toString.call (x)) {
    case '[object Array]':
      return FL.Array (x.length > 0 ? typeRep (x[0]) : FL.Unknown);
    case '[object Number]':
      return FL.Number;
    case '[object String]':
      return FL.String;
    default:
      if (x != null && 'fantasy-land' in x) return x['fantasy-land'];
      throw new Error ('Not implemented');
  }
};

//# FL.isSemigroup :: TypeRep a -> Boolean
FL.isSemigroup = tr => typeof tr.concat === 'function';

//# FL.isMonoid :: TypeRep a -> Boolean
FL.isMonoid = tr => FL.isSemigroup (tr) && typeof tr.empty === 'function';

//  Implementations of a given Fantasy Land type-class method often
//  dispatch to the implementation of that method for an inner type.
//  To define `equals` for `Identity a`, for example, one requires a
//  function of type `Setoid a => a -> a -> a` with which to compare
//  the two inner values.

//# FL.concat :: Semigroup a => a -> a -> a
FL.concat = x => {
  const tr = FL.typeRep (x);
  if (FL.isSemigroup (tr)) return tr.concat (x);
  throw new TypeError (show (tr) + ' does not satisfy Semigroup constraint');
};

//# FL.empty :: Monoid a => TypeRep a -> a
FL.empty = tr => {
  if (FL.isMonoid (tr)) return tr.empty ();
  throw new TypeError (show (tr) + ' does not satisfy Monoid constraint');
};


//  This section demonstrates the implications for sanctuary-maybe.

const Maybe = {};

//# Maybe._ :: TypeRep a -> TypeRep (Maybe a)
Maybe._ = $1 => Object.assign (
  {'@@show': () => 'Maybe (' + show ($1) + ')'},

  //  Semigroup a => Monoid (Maybe a)
  FL.isSemigroup ($1) ?
  {'concat': m1 => m2 =>
     m1.isJust ? m2.isJust ? Maybe.Just (FL.concat (m1.value) (m2.value)) : m1 : m2,
   'empty': () =>
     Maybe.Nothing} :
  {}
);

//# Maybe.Nothing_ :: TypeRep a -> Maybe a
Maybe.Nothing_ = $1 => ({
  'fantasy-land': Maybe._ ($1),
  '@@show':       () => 'Nothing',
  'isNothing':    true,
  'isJust':       false,
});

//# Maybe.Nothing :: Maybe Unknown
Maybe.Nothing = Maybe.Nothing_ (FL.Unknown);

//# Maybe.Just :: a -> Maybe a
Maybe.Just = value => ({
  'fantasy-land': Maybe._ (FL.typeRep (value)),
  '@@show':       () => 'Just (' + show (value) + ')',
  'isNothing':    false,
  'isJust':       true,
  'value':        value,
});


//  This section demonstrates the implications for sanctuary-pair.

//# Pair :: a -> b -> Pair a b
const Pair = fst => snd => ({
  'fantasy-land': Pair._ (FL.typeRep (fst)) (FL.typeRep (snd)),
  '@@show':       () => 'Pair (' + show (fst) + ') (' + show (snd) + ')',
  'fst':          fst,
  'snd':          snd,
});

//# Pair._ :: TypeRep a -> TypeRep b -> TypeRep (Pair a b)
Pair._ = $1 => $2 => Object.assign (
  {'@@show': () => 'Pair (' + show ($1) + ') (' + show ($2) + ')'},

  //  (Semigroup a, Semigroup b) => Semigroup (Pair a b)
  FL.isSemigroup ($1) && FL.isSemigroup ($2) ?
  {'concat': p1 => p2 =>
     Pair (FL.concat (p1.fst) (p2.fst))
          (FL.concat (p1.snd) (p2.snd))} :
  {},

  //  (Monoid a, Monoid b) => Monoid (Pair a b)
  FL.isMonoid ($1) && FL.isMonoid ($2) ?
  {'empty': () => Pair (FL.empty ($1)) (FL.empty ($2))} :
  {}
);


//  eq :: a -> a -> Undefined !
const eq = actual => expected => {
  assert.strictEqual (show (actual), show (expected));
};

//  throws :: (() -> Undefined !) -> Error -> Undefined !
const throws = thunk => expected => {
  assert.throws (
    thunk,
    err => err.name === expected.name && err.message === expected.message
  );
};

eq (FL.concat ('') ('')) ('');
eq (FL.concat ('') ('x')) ('x');
eq (FL.concat ('x') ('')) ('x');
eq (FL.concat ('x') ('y')) ('xy');

throws (() => { FL.concat (0) (0); })
       (new TypeError ('Number does not satisfy Semigroup constraint'));

eq (FL.concat ([]) ([])) ([]);
eq (FL.concat ([]) ([0])) ([0]);
eq (FL.concat ([0]) ([])) ([0]);
eq (FL.concat ([0]) ([1])) ([0, 1]);

eq (FL.concat (Maybe.Nothing) (Maybe.Nothing)) (Maybe.Nothing);
eq (FL.concat (Maybe.Nothing) (Maybe.Just ('x'))) (Maybe.Just ('x'));
eq (FL.concat (Maybe.Just ('x')) (Maybe.Nothing)) (Maybe.Just ('x'));
eq (FL.concat (Maybe.Just ('x')) (Maybe.Just ('y'))) (Maybe.Just ('xy'));

throws (() => { FL.concat (Maybe.Just (0)) (Maybe.Just (0)); })
       (new TypeError ('Maybe (Number) does not satisfy Semigroup constraint'));

eq (FL.concat (Pair ('x') ([0])) (Pair ('y') ([1]))) (Pair ('xy') ([0, 1]));

throws (() => { FL.concat (Pair ('') (0)) (Pair ('') (0)); })
       (new TypeError ('Pair (String) (Number) does not satisfy Semigroup constraint'));

//  These aliases make the following examples much clearer.
const NUMBER = FL.Number;
const STRING = FL.String;
const ARRAY = FL.Array;
const MAYBE = Maybe._;
const PAIR = Pair._;

eq (FL.empty (STRING)) ('');

eq (FL.empty (ARRAY (STRING))) ([]);

eq (FL.empty (MAYBE (STRING))) (Maybe.Nothing);

throws (() => { FL.empty (MAYBE (NUMBER)); })
       (new TypeError ('Maybe (Number) does not satisfy Monoid constraint'));

eq (FL.empty (PAIR (STRING) (ARRAY (STRING))))
   (Pair ('') ([]));

eq (FL.empty (PAIR (STRING) (MAYBE (ARRAY (NUMBER)))))
   (Pair ('') (Maybe.Nothing));

throws (() => { FL.empty (PAIR (STRING) (NUMBER)); })
       (new TypeError ('Pair (String) (Number) does not satisfy Monoid constraint'));
