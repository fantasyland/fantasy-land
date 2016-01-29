'use strict';

const Id = require('../id');
const {identity} = require('fantasy-combinators');
const {of, ap, sequence, map, equals} = require('..');
const {tagged} = require('daggy');

const Compose = tagged('c');
Compose[of] = Compose;
Compose.prototype[ap] = function(x) {
    return Compose(this.c.map(u => y => u.ap(y)).ap(x.c));
};
Compose.prototype[map] = function(f) {
    return Compose(this.c[map](y => y[map](f)));
};
Compose.prototype[equals] = function(x) {
    return this.c.equals ? this.c.equals(x.c) : this.c === x.c;
};

/*

### Traversable

1. `t(u.sequence(f.of))` is equivalent to `u.map(t).sequence(g.of)`
where `t` is a natural transformation from `f` to `g` (naturality)

2. `u.map(x => Id(x)).sequence(Id.of)` is equivalent to `Id.of` (identity)

3. `u.map(Compose).sequence(Compose.of)` is equivalent to
   `Compose(u.sequence(f.of).map(x => x.sequence(g.of)))` (composition)

*/

const naturality = t => eq => x => {
    const a = identity(t(x)[sequence](t[of]));
    const b = t(x)[map](identity)[sequence](t[of]);
    return eq(a, b);
};

const identityʹ = t => eq => x => {
    const a = t(x)[map](identity)[sequence](Id[of]);
    const b = Id[of](x);
    return eq(a, b);
};

const composition = t => eq => x => {
    const a = t(x)[map](Compose)[sequence](Compose[of]);
    const b = Compose(t(x)[sequence](Id[of])[map](x => x[sequence](Id[of])));
    return eq(a, b);
};

module.exports = { naturality
                 , identity: identityʹ
                 , composition 
                 };