'use strict';

const {of, chain} = require('..');

/**

### Monad

1. `m.of(a).chain(f)` is equivalent to `f(a)` (left identity)
2. `m.chain(m.of)` is equivalent to `m` (right identity)

**/

const leftIdentity = t => eq => x => f => {
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
