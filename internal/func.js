'use strict';

const fl = require('../');
const equality = (x, y) => x && typeof x[fl.equals] === 'function' ? x[fl.equals](y) : x === y;

module.exports = {
  equality,
};
