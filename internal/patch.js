'use strict';

const fl = require('..');

module.exports = () => {
  // Array

  Array.prototype[fl.equals] = function(that) {
    return this.length === that.length &&
      this.every((x, i) => x[fl.equals](that[i]));
  };

  Array.prototype[fl.lte] = function(that) {
    if (this.length === 0) return true;
    if (that.length === 0) return false;

    return this[0][fl.lte](that[0])
      ? this[0][fl.equals](that[0])
        ? this.slice(1)[fl.lte](that.slice(1))
        : true
      : false;
  };

  Array.prototype[fl.concat] = Array.prototype.concat;

  Array[fl.empty] = () => [];

  Array.prototype[fl.map] = function(f) {
    return this.map(x => f(x));
  };

  Array.prototype[fl.ap] = function(fs) {
    return fs[fl.chain](f => this.map(f));
  };

  Array[fl.of] = x => [x];

  Array.prototype[fl.alt] = Array.prototype.concat;

  Array[fl.zero] = Array[fl.empty];

  Array.prototype[fl.reduce] = function(f, init) {
    return this.reduce((acc, x) => f(acc, x), init);
  };

  Array.prototype[fl.traverse] = function(typeRep, f) {
    return this.map(f).reduce(
      (ys, x) => ys[fl.ap](x[fl.map](
        y => z => z[fl.concat](y)
      )),

      typeRep[fl.of]([])
    );
  };

  Array.prototype[fl.chain] = function(f) {
    return [].concat(... this.map(f));
  };

  Array.prototype[fl.extend] = function(f) {
    return [f(this)];
  };

  // Boolean

  Boolean.prototype[fl.equals] = function(that) {
    return this === that;
  }

  Boolean.prototype[fl.lte] = function(that) {
    return this ? that : true;
  }

  // Function

  Function.prototype[fl.concat] = function(that) {
    return x => this(x).concat(that(x));
  };

  /* Can't write fl.empty as we don't know the monoid :( */

  Function.prototype[fl.map] = function(that) {
    return x => that(this(x));
  };

  // ONLY FOR UNARIES.
  Function.prototype[fl.ap] = function(fs) {
    return x => fs(x)(this(x));
  };

  Function[fl.of] = x => _ => x;

  Function.prototype[fl.alt] = function(that) {
    return x => this(x)[fl.alt](that(x))
  };

  /* Can't write fl.zero as we don't know the alt :( */

  Function.prototype[fl.chain] = function(f) {
    return x => f(this(x))(x);
  };

  Function.prototype[fl.promap] = function(f, g) {
    return f[fl.map](this)[fl.map](g);
  };

  // Number

  Number.prototype[fl.equals] = function(that) {
    return this === that;
  };

  Number.prototype[fl.lte] = function(that) {
    return this <= that;
  };

  // Object

  Object.prototype[fl.equals] = function(that) {
    const keys = Object.keys(this)

    return keys[fl.equals](Object.keys(that))
      && keys.every(k => this[k][fl.equals](that[k]));
  };

  Object.prototype[fl.concat] = function(that) {
    return Object.assign({}, this, that);
  };

  Object[fl.empty] = () => ({});

  // Only makes sense for StrMaps!
  Object.prototype[fl.map] = function(f) {
    const result = {};

    Object.keys(this).forEach(
      k => result[k] = f(this[k])
    );

    return result;
  };

  // A function is really just (usually necessary) sugar
  // on an explicit mapping, which is a dictionary. Not
  // 100% sold on this implementation because of keys
  // e.g. (what if f :: a -> (x -> a)), but please review.
  Object.prototype[fl.promap] = function(f, g) {
    const result = {};

    Object.keys(this).forEach(
      k => result[f(k)] = g(this[k])
    );

    return result;
  };

  // String

  String.prototype[fl.equals] = function(that) {
    return this === that;
  };

  String.prototype[fl.lte] = function(that) {
    return this <= that;
  };

  String.prototype[fl.concat] = String.prototype.concat;

  String[fl.empty] = () => '';
};
