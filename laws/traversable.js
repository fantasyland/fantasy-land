'use strict';

const {id} = require('../id');
const {identity} = require('fantasy-combinators');
const {of, ap, reduce, sequence, map, equals, empty, concat} = require('..');

const compose = {}
compose[of] = function(c) {
    return {__proto__: compose, c};
}
compose[ap] = function(x) {
    return compose[of](this.c[map](u => y => u[ap](y))[ap](x.c));
}
compose[map] = function(f) {
    return compose[of](this.c[map](y => y[map](f)));
}
compose[equals] = function(x) {
    return this.c[equals] ? this.c[equals](x.c) : this.c === x.c;
}

Array.prototype[equals] = function(y) {
    return this.length === y.length && this.join('') === y.join('');
};
Array.prototype[map] = Array.prototype.map
Array.prototype[reduce] = Array.prototype.reduce
Array.prototype[concat] = Array.prototype.concat
Array.prototype[sequence] = function(p) {
    return this[reduce]((ys, x) => {
        return identity(x)[map](y => z => {
            return z[concat](y);
        })[ap](ys);
    }, p([]));
};

/*

### Traversable

1. `t(u.sequence(f.of))` is equivalent to `u.map(t).sequence(g.of)`
where `t` is a natural transformation from `f` to `g` (naturality)

2. `u.map(id.of).sequence(id.of)` is equivalent to `id.of` (identity)

3. `u.map(compose.of).sequence(compose.of)` is equivalent to
   `compose.of(u.sequence(f.of).map(x => x.sequence(g.of)))` (composition)

*/

const naturality = t => eq => x => {
    const a = identity(t(x)[sequence](t[of]));
    const b = t(x)[map](identity)[sequence](t[of]);
    return eq(a, b);
};

const identityʹ = t => eq => x => {
    const u = [x];

    const a = u[map](id[of])[sequence](id[of]);
    const b = id[of](u);
    return eq(a, b);
};

const composition = t => eq => x => {
    const a = t(x)[map](compose[of])[sequence](compose[of]);
    const b = compose[of](t(x)[sequence](id[of])[map](x => x[sequence](id[of])));
    return eq(a, b);
};

module.exports = { naturality
                 , identity: identityʹ
                 , composition
                 };
