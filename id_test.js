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
Sum[of] = (x) => Sum(x);
Sum[empty] = () => Sum('');
Sum.prototype[of] = Sum[of];
Sum.prototype[empty] = Sum[empty];
Sum.prototype[map] = function(f) {
    return Sum(f(this.v));
};
Sum.prototype[concat] = function(x) {
    return Sum(this.v + x.v);
};
Sum.prototype[equals] = function(x) {
    return this.v.equals ? this.v.equals(x.v) : this.v === x.v;
};

const equality = (x, y) => x.equals ? x.equals(y) : x === y;
const test = f => t => {
    t.ok(f("x"));
    t.done();
};

exports.applicative = {
    identity: test((x) => applicative.identity(Id)(equality)(x)),
    homomorphism: test((x) => applicative.homomorphism(Id)(equality)(x)),
    interchange: test((x) => applicative.interchange(Id)(equality)(x))
};

exports.apply = {
    composition: test((x) => apply.composition(Id)(equality)(x))
};

exports.chain = {
    associativity: test((x) => chain.associativity(Id)(equality)(x))
};

exports.chainRec = {
    equivalence: test((x) => {
      var predicate = a => a.length > 5
      var done = Id[of]
      var next = a => Id[of](a.concat([x]))
      var initial = [x]
      return chainRec.equivalence(Id)(equality)(predicate)(done)(next)(initial)
    })
};

exports.comonad = {
    leftIdentity: test((x) => comonad.leftIdentity(Id[of])(equality)(x)),
    rightIdentity: test((x) => comonad.rightIdentity(Id[of])(equality)(x)),
    associativity: test((x) => comonad.associativity(Id[of])(equality)(x))
};

exports.extend = {
    associativity: test((x) => extend.associativity(Id[of])(equality)(x))
};

exports.foldable = {
    associativity: test((x) => foldable.associativity(Id[of])(equality)(x))
};

exports.functor = {
    identity: test((x) => functor.identity(Id[of])(equality)(x)),
    composition: test((x) => functor.composition(Id[of])(equality)(x))
};

exports.monad = {
    leftIdentity: test((x) => monad.leftIdentity(Id)(equality)(x)),
    rightIdentity: test((x) => monad.rightIdentity(Id)(equality)(x))
};

exports.monoid = {
    leftIdentity: test((x) => monoid.leftIdentity(Id[of](Sum[empty]()))(equality)(Sum[of](x))),
    rightIdentity: test((x) => monoid.rightIdentity(Id[of](Sum[empty]()))(equality)(Sum[of](x)))
};

exports.semigroup = {
    associativity: test((x) => semigroup.associativity(Id[of])(equality)(x))
};

exports.setoid = {
    reflexivity: test((x) => setoid.reflexivity(Id[of])(equality)(x)),
    symmetry: test((x) => setoid.symmetry(Id[of])(equality)(x)),
    transitivity: test((x) => setoid.transitivity(Id[of])(equality)(x))
};

exports.traversable = {
    naturality: test((x) => traversable.naturality(Id[of])(equality)(Id[of](x))),
    identity: test((x) => traversable.identity(Id[of])(equality)(x)),
    composition: test((x) => traversable.composition(Id[of])(equality)(Id[of](Sum[of](x))))
};
