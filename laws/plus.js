'use strict';

const {pempty, alt, map} = require('..');

/**

### Alt

1. `x.alt(A.pempty())` is equivalent to `x` (right identity)
2. `A.pempty().alt(x)` is equivalent to `x` (left identity)
2. `A.pempty().map(f)` is equivalent to `A.pempty()` (annihilation)

**/

const rightIdentity = T => eq => x => eq(
  T[pempty]()[alt](x),
  x
);

const leftIdentity = T => eq => x => eq(
  x[alt](T[pempty]()),
  x
);

const annihilation = T => eq => f => eq(
  T[pempty]()[map](f),
  T[pempty]()
);

module.exports = {rightIdentity, leftIdentity, annihilation};
