'use strict';

const {identity, apply} = require('fantasy-combinators');
const {equals} = require('..');

/**

### Setoid

1. `a.equals(a) === true` (reflexivity)
2. `a.equals(b) === b.equals(a)` (symmetry)
3. If `a.equals(b)` and `b.equals(c)`, then `a.equals(c)` (transitivity)

**/

const reflexivity = t => eq => x => {
    const y = t(x);

    const a = y[equals](y);
    const b = true;
    return eq(a, b);
};

const symmetry = t => eq => x => {
    const f = t(x);
    const g = t(x);

    const a = f[equals](g);
    const b = g[equals](f);
    return eq(a, b);
};

const transitivity = t => eq => x => {
    const f = t(x);
    const g = t(x);
    const h = t(x);

    const a = f[equals](g);
    const b = g[equals](h);
    const c = f[equals](h);
    return eq(a && b, c);
};

module.exports = { reflexivity
                 , symmetry
                 , transitivity
                 };