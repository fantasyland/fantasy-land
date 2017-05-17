'use strict';

const {compose} = require('..');

/**

   ### Semigroupoid

   1. `a.compose(b).compose(c)` is equivalent to `a.compose(b.compose(c))` (associativity)

**/

const associativity = f => g => h => eq => x => {
  const a = f[compose](g)[compose](h)(x);
  const b = f[compose](g[compose](h))(x);
  return eq(a, b);
};

module.exports = {associativity};
