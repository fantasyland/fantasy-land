'use strict';

const {identity, thrush} = require('fantasy-combinators');
const {of, ap} = require('..');

/**

### Applicative

1. `v.ap(A.of(x => x))` is equivalent to `v` (identity)
2. `A.of(x).ap(A.of(f))` is equivalent to `A.of(f(x))` (homomorphism)
3. `A.of(y).ap(u)` is equivalent to `u.ap(A.of(f => f(y)))` (interchange)

**/

const identityʹ = T => eq => x => {
  const a = T[of](x)[ap](T[of](identity));
  const b = T[of](x);
  return eq(a, b);
};

const homomorphism = T => eq => x => {
  const a = T[of](x)[ap](T[of](identity));
  const b = T[of](identity(x));
  return eq(a, b);
};

const interchange = T => eq => x => {
  const u = T[of](identity);

  const a = T[of](x)[ap](u);
  const b = u[ap](T[of](thrush(x)));
  return eq(a, b);
};

module.exports = {identity: identityʹ, homomorphism, interchange};
