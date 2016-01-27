'use strict';

const {identity, apply} = require('fantasy-combinators');
const {ap} = require('../index');

const id = (t) => (eq) => (x) => {
    const a = t.of(identity).ap(t.of(x));
    const b = t.of(x);
    return eq(a, b);
};

const homomorphism = (t) => (eq) => (x) => {
    const a = t.of(identity).ap(t.of(x));
    const b = t.of(identity(x));
    return eq(a, b);
};

const interchange = (t) => (eq) => (x) => {
    const a = t.of(identity).ap(t.of(x));
    const b = t.of(apply(t)).ap(t.of(x));
    return eq(a, b);
};

modules.exports = { identity: id, homomorphism, interchange };