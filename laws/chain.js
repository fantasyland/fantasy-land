'use strict';

const {of, chain} = require('..');

/**

### Chain

1. `m.chain(f).chain(g)` is equivalent to `m.chain(x => f(x).chain(g))` (associativity)

**/

const associativity = t => eq => x => {
  const a = t[of](x)[chain](t[of])[chain](t[of]);
  const b = t[of](x)[chain](x => t[of](x)[chain](t[of]));
  return eq(a, b);
};

module.exports = {associativity};
