'use strict';

const {identity, compose} = require('fantasy-combinators');
const {contramap} = require('..');

/*

### Contravariant Functor

1. `u.contramap(a => a)` is equivalent to `u` (identity)
2. `u.contramap(x => f(g(x)))` is equivalent to `u.contramap(f).contramap(g)` (composition)

*/

const identityʹ = t => eq => x => {
  const a = t(x)[contramap](identity);
  const b = t(x);
  return eq(a, b);
};

const composition = t => eq => x => {
  const a = t(x)[contramap](compose(identity)(identity));
  const b = t(x)[contramap](identity)[contramap](identity);
  return eq(a, b);
};

module.exports = {identity: identityʹ, composition};
