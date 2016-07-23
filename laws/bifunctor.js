'use strict';

const {identity, compose} = require('fantasy-combinators');
const {bimap} = require('..');

/**
### Bifunctor

1. `p.bimap(a =>, b => b)` is equivalent to `p` (identity)
2. `p.bimap(compose(f1)(f2), compose(g1)(g2))` is equivalent to `p.bimap(f1, g1).bimap(f2, g2)` (composition)

**/

const identityʹ = t => eq => x => {
    const a = t(x)[bimap](identity, identity);
    const b = t(x);
    return eq(a, b);
};

const composition = t => eq => x => {
    const a = t(x)[bimap](compose(identity)(identity), compose(identity)(identity));
    const b = t(x)[bimap](identity, identity)[bimap](identity, identity);
    return eq(a, b);
};

modules.exports = { identity: identityʹ
                  , composition 
                  };
