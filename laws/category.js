'use strict';

const {compose, id} = require('..');

/**

   ### Category

   1. `a.compose(C.id())` is equivalent to `a` (right identity)
   2. `C.id().compose(a)` is equivalent to `a` (left identity)

**/

const leftIdentity = f => eq => x => {
  const a = f[compose](Function[id]())(x);
  const b = f(x);
  return eq(a, b);
};

const rightIdentity = f => eq => x => {
  const a = Function[id]()[compose](f)(x);
  const b = f(x);
  return eq(a, b);
};

module.exports = {leftIdentity, rightIdentity};
