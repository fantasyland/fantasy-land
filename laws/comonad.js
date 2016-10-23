'use strict';

const {identity} = require('fantasy-combinators');
const {extend, map, extract} = require('..');

/**

### Comonad

1. `w.extend(_w => _w.extract())` is equivalent to `w`
2. `w.extend(f).extract()` is equivalent to `f(w)`
3. `w.extend(f)` is equivalent to `w.extend(x => x).map(f)`

**/

const leftIdentity = t => eq => x => {
  const a = t(x)[extend](identity)[extract]();
  const b = t(x);
  return eq(a, b);
};

const rightIdentity = t => eq => x => {
  const a = t(x)[extend](w => w[extract]());
  const b = t(x);
  return eq(a, b);
};

const associativity = t => eq => x => {
  const a = t(x)[extend](identity);
  const b = t(x)[extend](identity)[map](identity);
  return eq(a, b);
};

module.exports = {leftIdentity, rightIdentity, associativity};
