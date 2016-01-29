'use strict';

const {identity, compose} = require('fantasy-combinators');
const {of, map, ap} = require('..');

/**

### Apply

1. `a.map(f => g => x => f(g(x))).ap(u).ap(v)` is equivalent to `a.ap(u.ap(v))` (composition)

**/

const composition = t => eq => x => {
    const y = t[of](identity);

    const a = y[map](compose)[ap](y)[ap](y);
    const b = y[ap](y[ap](y));
    return eq(a, b);
};

module.exports = { composition };