'use strict';

const {of, empty, concat, invert} = require('..');

/**

### Group

1. `g.concat(g.invert())` is equivalent to `g.empty()` (right inverse)
2. `g.invert().concat(g)` is equivalent to `g.empty()` (left inverse)

**/

const rightInverse = T => eq => x => {
  const g = T[of](x);

  const a = g[concat](g[invert]());
  const b = T[empty]();
  return eq(a, b);
};

const leftInverse = T => eq => x => {
  const g = T[of](x);

  const a = g[invert]()[concat](g);
  const b = T[empty]();
  return eq(a, b);
};

module.exports = {rightInverse, leftInverse};
