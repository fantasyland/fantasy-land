'use strict';

const {zero, alt, map} = require('..');

/**

### Alt

1. `x.alt(A.zero())` is equivalent to `x` (right identity)
2. `A.zero().alt(x)` is equivalent to `x` (left identity)
2. `A.zero().map(f)` is equivalent to `A.zero()` (annihilation)

**/

const rightIdentity = T => eq => x => eq(
  T[zero]()[alt](x),
  x
);

const leftIdentity = T => eq => x => eq(
  x[alt](T[zero]()),
  x
);

const annihilation = T => eq => f => eq(
  T[zero]()[map](f),
  T[zero]()
);

module.exports = {rightIdentity, leftIdentity, annihilation};
