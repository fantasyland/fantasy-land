'use strict';

const {identity, compose} = require('fantasy-combinators');
const {promap} = require('..');

/**
### Profunctor

1. `p.promap(a => a, b => b)` is equivalent to `p` (identity)
2. `p.promap(compose(f1)(f2), compose(g1)(g2))` is equivalent to `p.promap(f1, g1).promap(f2, g2)` (composition)

**/

const identityʹ = t => eq => x => {
    const a = t(x)[promap](identity, identity);
    const b = t(x);
    return eq(a, b);
};

const composition = t => eq => x => {
    const a = t(x)[promap](compose(identity)(identity), compose(identity)(identity));
    const b = t(x)[promap](identity, identity)[promap](identity, identity);
    return eq(a, b);
};

module.exports = { identity: identityʹ
                 , composition
                 };
