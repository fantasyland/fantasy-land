'use strict';

const fl = require('../');
const equality = (x, y) => typeof x[fl.equals] === 'function' ? x[fl.equals](y) : x === y;

module.exports = {
  equality,
};
