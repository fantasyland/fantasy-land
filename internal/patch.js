'use strict';

const fl = require('..');

module.exports = () => {
  String.prototype[fl.concat] = String.prototype.concat;
  Array.prototype[fl.equals] = function(y) {
    return this.length === y.length && this.join('') === y.join('');
  };
  Array.prototype[fl.map] = Array.prototype.map;
  Array.prototype[fl.chain] = function(f) {
    return [].concat(this.map(f));
  };
  Array.prototype[fl.reduce] = Array.prototype.reduce;
  Array.prototype[fl.concat] = Array.prototype.concat;
  Array.prototype[fl.traverse] = function(f, p) {
    return this.map(f)[fl.reduce](
      (ys, x) => ys[fl.ap](x[fl.map](y => z => z[fl.concat](y))),
      p([])
    );
  };
  // Array is MonadPlus but not MonadOr
  Array.prototype[fl.alt] = function(b) {
    return this.length > 0 ? this : b;
  };
  Array.prototype[fl.zero] = () => [];
};
