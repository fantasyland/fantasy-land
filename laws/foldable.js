'use strict';

const {identity} = require('fantasy-combinators');

/**

### Foldable

1. `u.reduce` is equivalent to `u.toArray().reduce`

**/

const associativity = t => eq => x => {
    const a = t(x).reduce(identity, x);
    const b = t(x).toArray().reduce(identity, x);
    return eq(a, b);
};

module.exports = { associativity };