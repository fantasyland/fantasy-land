'use strict';

const Id = require('../id');
const {of_, sequence, map} = require('..');
const {tagged} = require('daggy');

const Compose = tagged('x');
Compose[of_] = Compose;
Compose.prototype[map] = function(f) {
    return Compose(this.x[map](y => y[map](f)));
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
    const a = id(t(x)[sequence](t[of_]));
    const b = t(x)[map](id)[sequence](t[of_]);
    return eq(a, b);
};

const identity = t => eq => x => {
    const a = t(x)[map](Id)[sequence](Id[of_]);
    const b = Id[of_](x);
    return eq(a, b);
};

const composition = t => eq => x => {
    const a = t(x)[map](Compose)[sequence](Compose[of_]);
    const b = Compose(t(x)[sequence](Id[of_])[map](x => x[sequence](Id[of_])));
    return eq(a, b);
};

module.exports = { naturality
                 , identity 
                 , composition 
                 };