'use strict';

const {identity, compose} = require('fantasy-combinators');
const {dimap} = require('..');

/**

### Profunctor

1. `p.dimap(f, g)` is equivalent to `p` (identity)
2. `p.dimap(compose(f1)(f2)), compose(g1)(g2))` is equivalent to `p.dimap(f1, g1).dimap(f2, g2)` (composition)

**/

const identityʹ = t => eq => x => {
    const a = t(x)[dimap](identity, identity);
    const b = t(x);
    return eq(a, b);
};

const composition = t => eq => x => {
    const a = t(x)[dimap](compose(identity)(identity), compose(identity)(identity));
    const b = t(x)[dimap](identity, identity)[dimap](identity, identity);
    return eq(a, b);
};

module.exports = { identity: identityʹ
                 , composition 
                 };