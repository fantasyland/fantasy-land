'use strict';

const patch = require('./patch');
const Id = require('./id');
const Sum = require('./string_sum');
const Compose = require('./compose');
const {equality} = require('./func');

module.exports = {
  Id,
  Sum,
  Compose,
  equality,
  patch,
};
