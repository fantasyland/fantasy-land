'use strict';

/**

### Foldable

1. `u.reduce` is equivalent to `u.toArray().reduce`

**/

const associativity = t => eq => x => {
    const a = t.reduce(identity, x);
    const b = t.toArray().reduce(identity, x);
    return eq(a, b);
};

module.exports = { associativity };