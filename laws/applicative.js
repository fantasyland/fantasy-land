'use strict';

const {identity, thrush} = require('fantasy-combinators');
const {of, ap} = require('..');

/**

### Applicative

1. `a.of(x => x).ap(v)` is equivalent to `v` (identity)
2. `a.of(f).ap(a.of(x))` is equivalent to `a.of(f(x))` (homomorphism)
3. `u.ap(a.of(y))` is equivalent to `a.of(f => f(y)).ap(u)` (interchange)

**/

const identityʹ = t => eq => x => {
    const a = t[of](identity)[ap](t[of](x));
    const b = t[of](x);
    return eq(a, b);
};

const homomorphism = t => eq => x => {
    const a = t[of](identity)[ap](t[of](x));
    const b = t[of](identity(x));
    return eq(a, b);
};

const interchange = t => eq => x => {
    const u = t[of](identity);

    const a = u[ap](t[of](x));
    const b = t[of](thrush(x))[ap](u);
    return eq(a, b);
};

module.exports = { identity: identityʹ
                 , homomorphism
                 , interchange
                 };
