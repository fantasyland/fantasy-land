'use strict';

const {filter} = require('..');

/**

### Filterable

1. `v.filter(x => p(x) && q(x))` is equivalent to `v.filter(p).filter(q)` (distributivity)
2. `v.filter(x => true)` is equivalent to `v` (identity)
3. `v.filter(x => false)` is equivalent to `w.filter(x => false)`
   if `v` and `w` are values of the same Filterable (annihilation)

**/

const distributivity = eq => v => p => q => {
  const a = v[filter](x => p(x) && q(x));
  const b = v[filter](p)[filter](q);
  return eq(a, b);
};

const identity = eq => v => {
  const a = v[filter](x => true);
  const b = v;
  return eq(a, b);
};

const annihilation = eq => v => w => {
  const a = v[filter](x => false);
  const b = w[filter](x => false);
  return eq(a, b);
};

module.exports = {distributivity, identity, annihilation};
