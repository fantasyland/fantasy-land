'use strict';

const {apply} = require('fantasy-combinators');
const {chain} = require('../index');

const leftIdentity = (t) => (eq) => (x) => {
    const a = t.of(x)[chain](apply(t.of));
    const b = apply(t.of)(x);
    return eq(a, b);
};

const rightIdentity = (t) => (eq) => (x) => {
    const a = t.of(x)[chain](t.of);
    const b = t.of(x);
    return eq(a, b);
};

modules.exports = { leftIdentity, rightIdentity };