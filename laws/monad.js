'use strict';

const {identity, apply} = require('fantasy-combinators');
const {of_: of, chain} = require('..');

/**

### Monad

1. `m.of(a).chain(f)` is equivalent to `f(a)` (left identity)
2. `m.chain(m.of)` is equivalent to `m` (right identity)

**/

const leftIdentity = t => eq => x => {
    const a = t[of_](x)[chain](identity);
    const b = identity(x);
    return eq(a, b);
};

const rightIdentity = t => eq => x => {
    const a = t[of_](x)[chain](t[of_]);
    const b = t[of_](x);
    return eq(a, b);
};

module.exports = { leftIdentity
                 , rightIdentity 
                 };