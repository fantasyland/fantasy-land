'use strict';

const {Id, Compose} = require('../internal');
const {identity} = require('fantasy-combinators');
const {of, traverse, map} = require('..');

/**

### Traversable

1. `t(u.traverse(F, x => x))` is equivalent to `u.traverse(G, t)` for any
   `t` such that `t(a).map(f)` is equivalent to `t(a.map(f))` (naturality)

2. `u.traverse(F, F.of)` is equivalent to `F.of(u)` for any Applicative `F`
   (identity)

3. `u.traverse(Compose, x => new Compose(x))` is equivalent to
   `new Compose(u.traverse(F, x => x).map(x => x.traverse(G, x => x)))` for
   `Compose` defined below and any Applicatives `F` and `G` (composition)

**/

const naturality = T => t => eq => x => {
  const a = identity(t(x)[traverse](T, y => y));
  const b = t(x)[traverse](T, identity);
  return eq(a, b);
};

const identityʹ = T => eq => x => {
  const u = [x];

  const a = u[traverse](T, T[of]);
  const b = T[of](u);
  return eq(a, b);
};

const composition = T => t => eq => x => {
  const a = t(x)[traverse](Compose, Compose);
  const b = Compose(t(x)[traverse](Id, y => y)[map](x => x[traverse](Id, y => y)));
  return eq(a, b);
};

module.exports = {naturality, identity: identityʹ, composition};
