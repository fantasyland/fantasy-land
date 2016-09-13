'use strict';

const Id = require('../id');
const {identity} = require('fantasy-combinators');
const {of, ap, reduce, traverse, map, equals, empty, concat} = require('..');
const {tagged} = require('daggy');

const Compose = tagged('c');
Compose[of] = Compose;
Compose.prototype[ap] = function(f) {
    return Compose(this.c[ap](f.c[map](u => y => y[ap](u))));
};
Compose.prototype[map] = function(f) {
    return Compose(this.c[map](y => y[map](f)));
};
Compose.prototype[equals] = function(x) {
    return this.c[equals] ? this.c[equals](x.c) : this.c === x.c;
};

Array.prototype[equals] = function(y) {
    return this.length === y.length && this.join('') === y.join('');
};
Array.prototype[map] = Array.prototype.map
Array.prototype[reduce] = Array.prototype.reduce
Array.prototype[concat] = Array.prototype.concat
Array.prototype[traverse] = function(f, p) {
    return this.map(f)[reduce]((ys, x) => {
        return ys[ap](x[map](y => z => z[concat](y)));
    }, p([]));
};

/*

### Traversable

1. `t(u.traverse(x => x, F.of))` is equivalent to `u.traverse(t, G.of)`
for any `t` such that `t(a).map(f)` is equivalent to `t(a.map(f))` (naturality)

2. `u.traverse(F.of, F.of)` is equivalent to `F.of(u)` for any Applicative `F` (identity)

3. `u.traverse(x => new Compose(x), Compose.of)` is equivalent to
   `new Compose(u.traverse(x => x, F.of).map(x => x.traverse(x => x, G.of)))` for `Compose` defined below and any Applicatives `F` and `G` (composition)

*/

const naturality = t => eq => x => {
    const a = identity(t(x)[traverse](y => y, t[of]));
    const b = t(x)[traverse](identity, t[of]);
    return eq(a, b);
};

const identityʹ = t => eq => x => {
    const u = [x];

    const a = u[traverse](Id[of], Id[of]);
    const b = Id[of](u);
    return eq(a, b);
};

const composition = t => eq => x => {
    const a = t(x)[traverse](Compose, Compose[of]);
    const b = Compose(t(x)[traverse](y => y, Id[of])[map](x => x[traverse](y => y, Id[of])));
    return eq(a, b);
};

module.exports = { naturality
                 , identity: identityʹ
                 , composition
                 };
