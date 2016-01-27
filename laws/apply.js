'use strict';

const {identity, apply} = require('fantasy-combinators');
const {map, ap} = require('../index');

const composition = (t) => (eq) => (x) => {
    const y = t(x);

    const a = y[map](compose)[ap](y)[ap](y);
    const b = y[ap](y[ap](y));
    return eq(a, b);
};

modules.exports = { composition };