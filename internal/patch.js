'use strict';

const fl = require('..');

module.exports = () => {
  String.prototype[fl.concat] = String.prototype.concat;
  Array.prototype[fl.equals] = function(y) {
    return this.length === y.length && this.join('') === y.join('');
  };
  Array.prototype[fl.map] = function(f) {
    return this.map(x => f(x));
  };
  Array.prototype[fl.ap] = function(fs) {
    return fs[fl.chain](f => this.map(f));
  };
  Array.prototype[fl.chain] = function(f) {
    return [].concat(this.map(f));
  };
  Array.prototype[fl.reduce] = function(f, x) {
    return this.reduce((x, y) => f(x, y), x);
  };
  Array.prototype[fl.concat] = Array.prototype.concat;
  Array.prototype[fl.traverse] = function(typeRep, f) {
    return this[fl.map](f)[fl.reduce](
      (ys, x) => ys[fl.ap](x[fl.map](y => z => z[fl.concat](y))),
      typeRep[fl.of]([])
    );
  };
  Array.prototype[fl.alt] = function(b) {
    return this.concat(b);
  };
  Array[fl.zero] = () => [];

  Function.prototype[fl.compose] = function(g) {
    const f = this;
    return function(x) {
      return f(g(x));
    };
  };
  Function[fl.id] = function() {
    return function(x) {
      return x;
    };
  };
};
