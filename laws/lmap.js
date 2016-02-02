'use strict';

const {identity, compose} = require('fantasy-combinators');
const {lmap} = require('..');

/*

### lmap

1. `lmap(compose(f)(g)) = lmap(g).lmap(f)` (composition)

*/

const composition = t => eq => x => {
    const a = t(x)[lmap](compose(identity)(identity));
    const b = t(x)[lmap](identity)[lmap](identity);
    return eq(a, b);
};

module.exports = { composition };