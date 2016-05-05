'use strict';

const {identity, apply} = require('fantasy-combinators');
const {of, chain} = require('..');

/**

### Monad

1. `m.of(a).chain(f)` is equivalent to `f(a)` (left identity)
2. `m.chain(m.of)` is equivalent to `m` (right identity)

**/

const leftIdentity = t => eq => x => f => {
    const a = t[of](x)[chain](f);
    const b = f(x);
    return eq(a, b);
};

const rightIdentity = t => eq => x => f => {
    const a = f(x)[chain](t[of]);
    const b = f(x);
    return eq(a, b);
};

module.exports = { leftIdentity
                 , rightIdentity 
                 };