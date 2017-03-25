'use strict';

const fl = require('../');
const {equality, lte} = require('./func');

const {tagged} = require('daggy');

const Id = module.exports = tagged('value');

// Setoid
Id.prototype[fl.equals] = function(b) {
  return equality(this.value, b.value);
};

// Ord
Id.prototype[fl.lte] = function(b) {
  return lte(this.value, b.value);
};

// Semigroup (value must also be a Semigroup)
Id.prototype[fl.concat] = function(b) {
  return new Id(this.value[fl.concat](b.value));
};

// Monoid is not satisfiable since the type lacks a universal empty value

// Foldable
Id.prototype[fl.reduce] = function(f, acc) {
  return f(acc, this.value);
};

Id.prototype.toArray = function() {
  return [this.value];
};

// Functor
Id.prototype[fl.map] = function(f) {
  return new Id(f(this.value));
};

// Apply
Id.prototype[fl.ap] = function(b) {
  return new Id(b.value(this.value));
};

// Traversable
Id.prototype[fl.traverse] = function(typeRep, f) {
  // the typeRep argument is only provided for types where map might fail.
  return f(this.value)[fl.map](Id[fl.of]);
};

// Chain
Id.prototype[fl.chain] = function(f) {
  return f(this.value);
};

// ChainRec
Id[fl.chainRec] = function(f, i) {
  const next = v => ({done: false, value: v});
  const done = v => ({done: true, value: v});
  let state = {done: false, value: i};
  while (state.done === false) {
    state = f(next, done, state.value).value;
  }
  return new Id(state.value);
};

// Extend
Id.prototype[fl.extend] = function(f) {
  return new Id(f(this));
};

// Applicative
Id[fl.of] = function(a) {
  return new Id(a);
};

// Comonad
Id.prototype[fl.extract] = function() {
  return this.value;
};
