'use strict';

const {ap, compact, map, of, zero} = require('..');

/**

### Compactable

If value satisfies Functor:

1. `c.map(Just).compact()` is equivalent to `c` (identity)

If value satisfies Applicative:

1. `c.ap(c.constructor.of(Just)).compact()` is equivalent to `c` (identity)

If value satisfies Plus:

1. `c.map(x => Nothing).compact()` is equivalent to `c.constructor.zero()` (annihilation)

**/

//    Nothing :: Maybe a
const Nothing = {isJust: false};

//    Just :: a -> Maybe a
const Just = value => ({isJust: true, value});


const functorIdentity = eq => compactable => {
  const a = compactable[map](Just)[compact]();
  const b = compactable;
  return eq(a, b);
};

const applicativeIdentity = eq => compactable => {
  const a = compactable[ap](compactable.constructor[of](Just))[compact]();
  const b = compactable;
  return eq(a, b);
};

const plusAnnihilation = eq => compactable => {
  const a = compactable[map](x => Nothing)[compact]();
  const b = compactable.constructor[zero]();
  return eq(a, b);
};

module.exports = {functorIdentity, applicativeIdentity, plusAnnihilation};
