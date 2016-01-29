'use strict';

const {id: identity, compose} = require('fantasy-combinators');
const {dimap} = require('..');

/**

### Profunctor

1. `p.dimap(f, g)` is equivalent to `p` (identity)
2. `p.dimap(compose(f1)(f2)), compose(g1)(g2))` is equivalent to `p.dimap(f1, g1).dimap(f2, g2)` (composition)

**/

const identity = t => eq => x => {
    const a = t(x)[dimap](id, id);
    const b = t(x);
    return eq(a, b);
};

const composition = t => eq => x => {
    const a = p[dimap](compose(id)(id), compose(id)(id));
    const b = p[dimap](id, id)[dimap](id, id);
    return eq(a, b);
};

modules.exports = { identity
                  , composition 
                  };