'use strict';

const {identity} = require('fantasy-combinators');
const {extend} = require('..');

/**

### Extend

1. `w.extend(g).extend(f)` is equivalent to `w.extend(_w => f(_w.extend(g)))`

**/

const associativity = t => eq => x => {
    const a = t(x)[extend](identity)[extend](identity);
    const b = t(x)[extend](w => identity(w[extend](identity)));
    return eq(a, b);
};

module.exports = { associativity };
