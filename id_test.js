'use strict';

const applicative = require('./laws/applicative');
const apply = require('./laws/apply');
const chain = require('./laws/chain');
const chainRec = require('./laws/chainrec');
const comonad = require('./laws/comonad');
const extend = require('./laws/extend');
const foldable = require('./laws/foldable');
const functor = require('./laws/functor');
const monad = require('./laws/monad');
const monoid = require('./laws/monoid');
const semigroup = require('./laws/semigroup');
const setoid = require('./laws/setoid');
const traversable = require('./laws/traversable');

const {tagged} = require('daggy');
const {of, empty, concat, equals, map} = require('.');

const {id} = require('./id');

// Special type of sum for the type of string.
const sum = {};
sum[of] = (v) => ({__proto__: sum, v});
sum[empty] = () => sum[of]('');
sum[map] = function(f) {
    return sum[of](f(this.v));
};
sum[concat] = function(x) {
    return sum[of](this.v + x.v);
};
sum[equals] = function(x) {
    return this.v[equals] ? this.v[equals](x.v) : this.v === x.v;
};

const equality = (x, y) => x[equals] ? x[equals](y) : x === y;
const test = f => t => {
    t.ok(f("x"));
    t.done();
};

exports.applicative = {
    identity: test((x) => applicative.identity(id)(equality)(x)),
    homomorphism: test((x) => applicative.homomorphism(id)(equality)(x)),
    interchange: test((x) => applicative.interchange(id)(equality)(x))
};

exports.apply = {
    composition: test((x) => apply.composition(id)(equality)(x))
};

exports.chain = {
    associativity: test((x) => chain.associativity(id)(equality)(x))
};

exports.chainRec = {
    equivalence: test((x) => {
      var predicate = a => a.length > 5
      var done = id[of]
      var next = a => id[of](a[concat]([x]))
      var initial = [x]
      return chainRec.equivalence(id)(equality)(predicate)(done)(next)(initial)
    })
};

exports.comonad = {
    leftIdentity: test((x) => comonad.leftIdentity(id[of])(equality)(x)),
    rightIdentity: test((x) => comonad.rightIdentity(id[of])(equality)(x)),
    associativity: test((x) => comonad.associativity(id[of])(equality)(x))
};

exports.extend = {
    associativity: test((x) => extend.associativity(id[of])(equality)(x))
};

exports.foldable = {
    associativity: test((x) => foldable.associativity(id[of])(equality)(x))
};

exports.functor = {
    identity: test((x) => functor.identity(id[of])(equality)(x)),
    composition: test((x) => functor.composition(id[of])(equality)(x))
};

exports.monad = {
    leftIdentity: test((x) => monad.leftIdentity(id)(equality)(x)),
    rightIdentity: test((x) => monad.rightIdentity(id)(equality)(x))
};

exports.monoid = {
    leftIdentity: test((x) => monoid.leftIdentity(id[of](sum[empty]()))(equality)(sum[of](x))),
    rightIdentity: test((x) => monoid.rightIdentity(id[of](sum[empty]()))(equality)(sum[of](x)))
};

// Semigroup tests are broken otherwise for this.
String.prototype[concat] = String.prototype.concat

exports.semigroup = {
    associativity: test((x) => semigroup.associativity(id[of])(equality)(x))
};

exports.setoid = {
    reflexivity: test((x) => setoid.reflexivity(id[of])(equality)(x)),
    symmetry: test((x) => setoid.symmetry(id[of])(equality)(x)),
    transitivity: test((x) => setoid.transitivity(id[of])(equality)(x))
};

exports.traversable = {
    naturality: test((x) => traversable.naturality(id[of])(equality)(id[of](x))),
    identity: test((x) => traversable.identity(id[of])(equality)(x)),
    composition: test((x) => traversable.composition(id[of])(equality)(id[of](sum[of](x))))
};
