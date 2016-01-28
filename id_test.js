'use strict';

const applicative = require('./laws/applicative');
const apply = require('./laws/apply');
const chain = require('./laws/chain');
const comonad = require('./laws/comonad');

const Id = require('./id');

const equality = (x, y) => x.equals(y);

exports.applicative = { identity: t => { t.ok(applicative.identity(Id)(equality)(1)); t.done(); }
                      , homomorphism: t => { t.ok(applicative.homomorphism(Id)(equality)(1)); t.done(); }
                      , interchange: t => { t.ok(applicative.interchange(Id)(equality)(1)); t.done(); }
                      };

exports.apply = { composition: t => { t.ok(apply.composition(Id)(equality)(1)); t.done(); } };

exports.chain = { associativity: t => { t.ok(chain.associativity(Id)(equality)(1)); t.done(); } };

exports.comonad = { leftIdentity: t => { t.ok(comonad.leftIdentity(Id.of)(equality)(1)); t.done(); } 
                  , rightIdentity: t => { t.ok(comonad.rightIdentity(Id.of)(equality)(1)); t.done(); } 
                  , associativity: t => { t.ok(comonad.associativity(Id.of)(equality)(1)); t.done(); } 
                  };