'use strict';

const {identity} = require('fantasy-combinators');

/**

### ChainRec

1. `t.chainRec((next, done, v) => p(v) ? d(v).map(done) : n(v).map(next), i)`
   is equivalent to
   `(function step(v) { return p(v) ? d(v) : n(v).chain(step); }(i))`
   (equivalence)
**/

const equivalence = t => eq => p => d => n => x => {
    const a = t.chainRec((next, done, v) => p(v) ? d(v).map(done) : n(v).map(next), x);
    const b = (function step(v) { return p(v) ? d(v) : n(v).chain(step); }(x));
    return eq(a, b);
};

module.exports = { equivalence };
