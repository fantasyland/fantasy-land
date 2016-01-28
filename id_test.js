'use strict';

const applicative = require('./laws/applicative');
const apply = require('./laws/apply');
const chain = require('./laws/chain');
const comonad = require('./laws/comonad');
const extend = require('./laws/extend');
const foldable = require('./laws/foldable');
const functor = require('./laws/functor');
const monad = require('./laws/monad');
const monoid = require('./laws/monoid');

const Id = require('./id');

const equality = (x, y) => x.equals ? x.equals(y) : x === y;

exports.applicative =   { 
    identity: t => { t.ok(applicative.identity(Id)(equality)(1)); t.done(); }, 
    homomorphism: t => { t.ok(applicative.homomorphism(Id)(equality)(1)); t.done(); }, 
    interchange: t => { t.ok(applicative.interchange(Id)(equality)(1)); t.done(); }
};

exports.apply = { 
    composition: t => { t.ok(apply.composition(Id)(equality)(1)); t.done(); } 
};

exports.chain = { 
    associativity: t => { t.ok(chain.associativity(Id)(equality)(1)); t.done(); } 
};

exports.comonad = { 
    leftIdentity: t => { t.ok(comonad.leftIdentity(Id.of)(equality)(1)); t.done(); }, 
    rightIdentity: t => { t.ok(comonad.rightIdentity(Id.of)(equality)(1)); t.done(); },
    associativity: t => { t.ok(comonad.associativity(Id.of)(equality)(1)); t.done(); }
};

exports.extend = { 
    associativity: t => { t.ok(extend.associativity(Id.of)(equality)(1)); t.done(); } 
};

exports.foldable = { 
    associativity: t => { t.ok(foldable.associativity(Id.of)(equality)(1)); t.done(); } 
};

exports.functor = { 
    identity: t => { t.ok(functor.identity(Id.of)(equality)(1)); t.done(); },
    composition: t => { t.ok(functor.composition(Id.of)(equality)(1)); t.done(); }
};

exports.monad = { 
    leftIdentity: t => { t.ok(monad.leftIdentity(Id)(equality)(1)); t.done(); },
    rightIdentity: t => { t.ok(monad.rightIdentity(Id)(equality)(1)); t.done(); }
};
