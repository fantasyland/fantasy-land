'use strict';

const {chain} = require('../index');

const associativity = (t) => (eq) => (x) => {
    const a = t.of(x)[chain](t.of)[chain](t.of);
    const b = t.of(x)[chain]((x) => t.of(x).chain(t.of));
    return eq(a, b);
};

modules.exports = { associativity };