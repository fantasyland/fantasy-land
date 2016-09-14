'use strict';

const {identity, apply} = require('fantasy-combinators');
const {of, empty, concat} = require('..');

/**

### Monoid

1. `m.concat(m.constructor.empty)` is equivalent to `m` (right identity)
2. `m.constructor.empty.concat(m)` is equivalent to `m` (left identity)

**/

const rightIdentity = t => eq => x => {
    const a = t[of](x)[concat](t[empty]);
    const b = t[of](x);
    return eq(a, b);
};

const leftIdentity = t => eq => x => {
    const a = t[empty][concat](t[of](x));
    const b = t[of](x);
    return eq(a, b);
};

module.exports = { rightIdentity
                 , leftIdentity
                 };
