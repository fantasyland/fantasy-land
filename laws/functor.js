'use strict';

const {identity, compose} = require('fantasy-combinators');
const {map} = require('../index');

const id =(t) => (eq) => (x) => {
    const a = t(x)[map](identity);
    const b = t(x);
    return eq(a, b);
};

const composition = (t) => (eq) => (x) => {
    const a = t(x)[map](compose(identity)(identity));
    const b = t(x)[map](identity)[map](identity);
    return eq(a, b);
};

modules.exports = { identity: id, composition };