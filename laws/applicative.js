'use strict';

const {identity, thrush} = require('fantasy-combinators');
const {of, ap} = require('..');

/**

### Applicative

1. `v.ap(a.of(x => x))` is equivalent to `v` (identity)
2. `a.of(x).ap(a.of(f))` is equivalent to `a.of(f(x))` (homomorphism)
3. `a.of(y).ap(u)` is equivalent to `u.ap(a.of(f => f(y)))` (interchange)

**/

const identityʹ = t => eq => x => {
  const a = t[of](x)[ap](t[of](identity));
  const b = t[of](x);
  return eq(a, b);
};

const homomorphism = t => eq => x => {
  const a = t[of](x)[ap](t[of](identity));
  const b = t[of](identity(x));
  return eq(a, b);
};

const interchange = t => eq => x => {
  const u = t[of](identity);

  const a = t[of](x)[ap](u);
  const b = u[ap](t[of](thrush(x)));
  return eq(a, b);
};

module.exports = {identity: identityʹ, homomorphism, interchange};
