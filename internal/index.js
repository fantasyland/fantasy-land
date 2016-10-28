'use strict';

const patch = require('./patch');
const Maybe = require('./maybe');
const Id = require('./id');
const Sum = require('./string_sum');
const Compose = require('./compose');
const {equality} = require('./func');

module.exports = {
  Maybe,
  Id,
  Sum,
  Compose,
  equality,
  patch,
};
