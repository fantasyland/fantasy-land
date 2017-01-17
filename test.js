'use strict';

const fl = require('.');
const {Id, equality, Sum, patch} = require('./internal');
patch();

const alt = require('./laws/alt');
const alternative = require('./laws/alternative');
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
const plus = require('./laws/plus');
const semigroup = require('./laws/semigroup');
const setoid = require('./laws/setoid');
const traversable = require('./laws/traversable');

const test = f => t => {
  t.ok(f('x') === true);
  t.done();
};

exports.alt = {
  associativity: test(x => alt.associativity(equality)(Array[fl.zero]())([x])(Array[fl.zero]())),
  distributivity: test(x => alt.distributivity(equality)(Array[fl.zero]())([x])(a => [a])),
};

exports.alternative = {
  distributivity: test(
    x => alternative.distributivity(equality)([x])(Array[fl.zero]())([a => [a]])
  ),
  annihilation: test(
    x => alternative.annihilation(Array)(equality)([x])
  ),
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
    const done = Id[fl.of];
    const next = a => Id[fl.of](a[fl.concat]([x]));
    const initial = [x];
    return chainRec.equivalence(Id)(equality)(predicate)(done)(next)(initial);
  }),
};

exports.comonad = {
  leftIdentity: test(comonad.leftIdentity(Id[fl.of])(equality)),
  rightIdentity: test(comonad.rightIdentity(Id[fl.of])(equality)),
};

exports.extend = {
  associativity: test(extend.associativity(Id[fl.of])(equality)),
};

exports.foldable = {
  associativity: test(foldable.associativity(Id[fl.of])(equality)),
};

exports.functor = {
  identity: test(functor.identity(Id[fl.of])(equality)),
  composition: test(functor.composition(Id[fl.of])(equality)(a => [a, a])(a => [a])),
};

exports.monad = {
  leftIdentity: test(monad.leftIdentity(Id)(equality)(Id[fl.of])),
  rightIdentity: test(monad.rightIdentity(Id)(equality)),
};

exports.plus = {
  rightIdentity: test(x => plus.rightIdentity(Array)(equality)([x])),
  leftIdentity: test(x => plus.leftIdentity(Array)(equality)([x])),
  annihilation: test(x => plus.annihilation(Array)(equality)(a => [a])),
};

exports.monoid = {
  leftIdentity: test(monoid.leftIdentity(Sum)(equality)),
  rightIdentity: test(monoid.rightIdentity(Sum)(equality)),
};

exports.semigroup = {
  associativity: test(semigroup.associativity(Id[fl.of])(equality)),
};

exports.setoid = {
  reflexivity: test(setoid.reflexivity(Id[fl.of])(equality)),
  symmetry: test(setoid.symmetry(Id[fl.of])(equality)),
  transitivity: test(setoid.transitivity(Id[fl.of])(equality)),
};

exports.traversable = {
  naturality: test(x => traversable.naturality(Id)(Id[fl.of])(equality)(Id[fl.of](x))),
  identity: test(traversable.identity(Id)(equality)),
  composition: test(x => traversable.composition(Id)(Id[fl.of])(equality)(Id[fl.of](Sum[fl.of](x)))),
};
