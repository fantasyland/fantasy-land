'use strict';

const {identity, apply} = require('fantasy-combinators');
const {concat} = require('..');

/**

### Monoid

1. `m.concat(m.empty())` is equivalent to `m` (right identity)
2. `m.empty().concat(m)` is equivalent to `m` (left identity)

**/

const rightIdentity = t => eq => x => {
    const a = t(x)[concat](t.empty());
    const b = t(x);
    return eq(a, b);
};

const leftIdentity = t => eq => x => {
    const a = t.empty()[concat](t(x));
    const b = t(x);
    return eq(a, b);
};

module.exports = { rightIdentity
                 , leftIdentity 
                 };