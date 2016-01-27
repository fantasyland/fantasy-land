'use strict';

const {identity, apply} = require('fantasy-combinators');
const {concat} = require('../index');

const rightIdentity = (t) => (eq) => (x) => {
    const a = t(x)[concat](t.empty());
    const b = t(x);
    return eq(a, b);
};

const leftIdentity = (t) => (eq) => (x) => {
    const a = t.empty()[concat](t(x));
    const b = t(x);
    return eq(a, b);
};

modules.exports = { rightIdentity, leftIdentity };