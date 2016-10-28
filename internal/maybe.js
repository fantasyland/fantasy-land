'use strict';

const {taggedSum} = require('daggy');

const fl = require('..');
const {equality} = require('./func');

const Maybe = module.exports = taggedSum({
  Just: ['x'],
  Nothing: [],
});

Maybe.prototype[fl.equals] = function(b) {
  return this.cata({
    Just: x =>  this.cata({
      Just: y => equality(x, y),
      Nothing: () => false,
    }),
    Nothing: () => this.cata({
      Just: _ => false,
      Nothing: () => true,
    }),
  });
};

Maybe.prototype[fl.chain] = function(f) {
  return this.cata({
    Just: x => f(x),
    Nothing: () => this,
  });
};

Maybe.prototype[fl.ap] = function(m) {
  return m[fl.chain](f => this[fl.map](f));
};

Maybe[fl.of] = Maybe.Just;

Maybe.prototype[fl.map] = function(f) {
  return this[fl.chain](a => Maybe[fl.of](f(a)));
};

Maybe[fl.zero] = () => Maybe.Nothing;

Maybe.prototype[fl.alt] = function(b) {
  return this.cata({
    Just: _ => this,
    Nothing: () => b,
  });
};
