'use strict';

const {identity, apply} = require('fantasy-combinators');
const {concat} = require('../index');

const associativity = (t) => (eq) => (x) => {
    const f = t(x);
    const g = t(x);
    const h = t(x);

    const a = f[concat](g)[concat](h);
    const b = f[concat](g[concat](h));
    return eq(a, b);
};

modules.exports = { associativity };