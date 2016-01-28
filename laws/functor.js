'use strict';

const {id: identity, compose} = require('fantasy-combinators');
const {map} = require('..');

/*

### Functor

1. `u.map(a => a)` is equivalent to `u` (identity)
2. `u.map(x => f(g(x)))` is equivalent to `u.map(g).map(f)` (composition)

*/

const identity = t => eq => x => {
    const a = t(x)[map](id);
    const b = t(x);
    return eq(a, b);
};

const composition = t => eq => x => {
    const a = t(x)[map](compose(id)(id));
    const b = t(x)[map](id)[map](id);
    return eq(a, b);
};

module.exports = { identity
                 , composition 
                 };