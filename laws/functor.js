'use strict';

const {map} = require('..');

/*

### Functor

1. `u.map(a => a)` is equivalent to `u` (identity)
2. `u.map(x => f(g(x)))` is equivalent to `u.map(g).map(f)` (composition)

*/

const identity = of => eq => x => {
    const a = of(x)[map](x => x);
    const b = of(x);
    return eq(a, b);
};

const composition = of => eq => x => f => g => {
    const a = of(x)[map](x => f(g(x)));
    const b = of(x)[map](g)[map](f);
    return eq(a, b);
};

module.exports = { identity
                 , composition
                 };
