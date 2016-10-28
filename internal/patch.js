'use strict';

const fl = require('..');

module.exports = () => {
  String.prototype[fl.concat] = String.prototype.concat;
  Array.prototype[fl.equals] = function(y) {
    return this.length === y.length && this.join('') === y.join('');
  };
  Array.prototype[fl.map] = Array.prototype.map;
  Array.prototype[fl.reduce] = Array.prototype.reduce;
  Array.prototype[fl.concat] = Array.prototype.concat;
  Array.prototype[fl.traverse] = function(f, p) {
    return this.map(f)[fl.reduce](
      (ys, x) => ys[fl.ap](x[fl.map](y => z => z[fl.concat](y))),
      p([])
    );
  };
};
