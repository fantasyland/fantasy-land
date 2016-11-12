'use strict';

const {alt, zero, ap} = require('..');

/**

### Alternative

1. `x.ap(f.alt(g))` is equivalent to `x.ap(f).alt(x.ap(g))` (distributivity)
1. `x.ap(M.zero())` is equivalent to `M.zero()` (annihilation)

**/

const distributivity = eq => x => f => g => eq(
  x[ap](f[alt](g)),
  x[ap](f)[alt](x[ap](g))
);

const annihilation = T => eq => x => eq(
  x[ap](T[zero]()),
  T[zero]()
);

module.exports = {distributivity, annihilation};
