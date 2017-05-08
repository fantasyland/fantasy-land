'use strict';

const fl = require('../');

const equality = (x, y) =>
  typeof x[fl.equals] === 'function'
  ? x[fl.equals](y)
  : x === y;

const lte = (x, y) => {
  if (typeof x[fl.lte] === 'function') {
    return x[fl.lte](y);
  }

  const typeX = typeof x;
  const typeY = typeof y;

  return typeX === typeY
    && ['string', 'number'].indexOf(typeX) !== -1
    && x <= y;
};

module.exports = {
  equality,
  lte,
};
