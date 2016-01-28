'use strict';

const {identity, compose} = require('fantasy-combinators');
const {map} = require('..');

/*

### Functor

1. `u.map(a => a)` is equivalent to `u` (identity)
2. `u.map(x => f(g(x)))` is equivalent to `u.map(g).map(f)` (composition)

*/

const identityʹ = t => eq => x => {
    const a = t(x)[map](identity);
    const b = t(x);
    return eq(a, b);
};

const composition = t => eq => x => {
    const a = t(x)[map](compose(identity)(identity));
    const b = t(x)[map](identity)[map](identity);
    return eq(a, b);
};

module.exports = { identity: identityʹ
                 , composition 
                 };