'use strict';

const {concat} = require('..');

/**

### Semigroup

1. `a.concat(b).concat(c)` is equivalent to `a.concat(b.concat(c))` (associativity)

**/

const associativity = t => eq => x => {
  const f = t(x);
  const g = t(x);
  const h = t(x);

  const a = f[concat](g)[concat](h);
  const b = f[concat](g[concat](h));
  return eq(a, b);
};

module.exports = {associativity};
