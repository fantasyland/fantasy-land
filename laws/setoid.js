'use strict';

const {identity, apply} = require('fantasy-combinators');
const {equals} = require('../index');

const reflexivity = (t) => (eq) => (x) => {
    const y = t(x);

    const a = y[equals](y);
    const b = true;
    return eq(a, b);
};

const symmetry = (t) => (eq) => (x) => {
    const f = t(x);
    const g = t(x);

    const a = f[equals](g);
    const b = g[equals](f);
    return eq(a, b);
};

const transitivity = (t) => (eq) => (x) => {
    const f = t(x);
    const g = t(x);
    const h = t(x);

    const a = f[equals](g);
    const b = g[equals](h);
    const c = f[equals](h);
    return eq(a && b, c);
};

modules.exports = { reflexivity, symmetry, transitivity };