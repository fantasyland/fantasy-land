'use strict';

const {alt, pempty, ap} = require('..');

/**

### Alternative

1. `x.ap(f.alt(g))` is equivalent to `x.ap(f).alt(x.ap(g))` (distributivity)
1. `x.ap(M.pempty())` is equivalent to `M.pempty()` (annihilation)

**/

const distributivity = eq => x => f => g => eq(
  x[ap](f[alt](g)),
  x[ap](f)[alt](x[ap](g))
);

const annihilation = T => eq => x => eq(
  x[ap](T[pempty]()),
  T[pempty]()
);

module.exports = {distributivity, annihilation};
