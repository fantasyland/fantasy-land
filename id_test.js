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

const Id = require('./id');

// Special type of sum for the type of string.
const Sum = tagged('v');
Sum[of] = Sum;
Sum[empty] = () => Sum('');
Sum.prototype[map] = function(f) {
  return Sum(f(this.v));
};
Sum.prototype[concat] = function(x) {
  return Sum(this.v + x.v);
};
Sum.prototype[equals] = function(x) {
  return this.v[equals] ? this.v[equals](x.v) : this.v === x.v;
};

const equality = (x, y) => x[equals] ? x[equals](y) : x === y;
const test = f => t => {
  t.ok(f('x'));
  t.done();
};

exports.applicative = {
  identity: test(applicative.identity(Id)(equality)),
  homomorphism: test(applicative.homomorphism(Id)(equality)),
  interchange: test(applicative.interchange(Id)(equality)),
};

exports.apply = {
  composition: test(apply.composition(Id)(equality)),
};

exports.chain = {
  associativity: test(chain.associativity(Id)(equality)),
};

exports.chainRec = {
  equivalence: test(x => {
    const predicate = a => a.length > 5;
    const done = Id[of];
    const next = a => Id[of](a[concat]([x]));
    const initial = [x];
    return chainRec.equivalence(Id)(equality)(predicate)(done)(next)(initial);
  }),
};

exports.comonad = {
  leftIdentity: test(comonad.leftIdentity(Id[of])(equality)),
  rightIdentity: test(comonad.rightIdentity(Id[of])(equality)),
  associativity: test(comonad.associativity(Id[of])(equality)),
};

exports.extend = {
  associativity: test(extend.associativity(Id[of])(equality)),
};

exports.foldable = {
  associativity: test(foldable.associativity(Id[of])(equality)),
};

exports.functor = {
  identity: test(functor.identity(Id[of])(equality)),
  composition: test(functor.composition(Id[of])(equality)),
};

exports.monad = {
  leftIdentity: test(monad.leftIdentity(Id)(equality)),
  rightIdentity: test(monad.rightIdentity(Id)(equality)),
};

exports.monoid = {
  leftIdentity: test(monoid.leftIdentity(Sum)(equality)),
  rightIdentity: test(monoid.rightIdentity(Sum)(equality)),
};

// Semigroup tests are broken otherwise for this.
String.prototype[concat] = String.prototype.concat;

exports.semigroup = {
  associativity: test(semigroup.associativity(Id[of])(equality)),
};

exports.setoid = {
  reflexivity: test(setoid.reflexivity(Id[of])(equality)),
  symmetry: test(setoid.symmetry(Id[of])(equality)),
  transitivity: test(setoid.transitivity(Id[of])(equality)),
};

exports.traversable = {
  naturality: test(x => traversable.naturality(Id[of])(equality)(Id[of](x))),
  identity: test(traversable.identity(Id[of])(equality)),
  composition: test(x => traversable.composition(Id[of])(equality)(Id[of](Sum[of](x)))),
};
