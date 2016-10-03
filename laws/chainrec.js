'use strict';

const {chain, map, chainRec} = require('..');

/**

### ChainRec

1. `M.chainRec((next, done, v) => p(v) ? d(v).map(done) : n(v).map(next), i)`
   is equivalent to
   `(function step(v) { return p(v) ? d(v) : n(v).chain(step); }(i))`
   (equivalence)
**/

const equivalence = T => eq => p => d => n => x => {
  const a = T[chainRec]((next, done, v) => p(v) ? d(v)[map](done) : n(v)[map](next), x);
  const b = (function step(v) { return p(v) ? d(v) : n(v)[chain](step); }(x));
  return eq(a, b);
};

module.exports = {equivalence};
