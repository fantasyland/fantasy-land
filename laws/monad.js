'use strict';

const {of, chain} = require('..');

/**

### Monad

1. `M.of(a).chain(f)` is equivalent to `f(a)` (left identity)
2. `m.chain(M.of)` is equivalent to `m` (right identity)

**/

const leftIdentity = t => eq => f => x => {
  const a = t[of](x)[chain](f);
  const b = f(x);
  return eq(a, b);
};

const rightIdentity = t => eq => x => {
  const a = t[of](x)[chain](t[of]);
  const b = t[of](x);
  return eq(a, b);
};

module.exports = {leftIdentity, rightIdentity};
