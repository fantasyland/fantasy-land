'use strict';

const {tagged} = require('daggy');

const fl = require('..');
const {equality} = require('./func');

// Special type of sum for the type of string.
const Sum = module.exports = tagged('v');
Sum[fl.of] = Sum;
Sum[fl.empty] = () => Sum('');
Sum.prototype[fl.map] = function(f) {
  return Sum(f(this.v));
};
Sum.prototype[fl.concat] = function(x) {
  return Sum(this.v + x.v);
};
Sum.prototype[fl.equals] = function(x) {
  return equality(this.v, x.v);
};
