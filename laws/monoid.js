'use strict';

const {of, empty, concat} = require('..');

/**

### Monoid

1. `m.concat(m.constructor.empty())` is equivalent to `m` (right identity)
2. `m.constructor.empty().concat(m)` is equivalent to `m` (left identity)

**/

const rightIdentity = T => eq => x => {
  const a = T[of](x)[concat](T[empty]());
  const b = T[of](x);
  return eq(a, b);
};

const leftIdentity = T => eq => x => {
  const a = T[empty]()[concat](T[of](x));
  const b = T[of](x);
  return eq(a, b);
};

module.exports = {rightIdentity, leftIdentity};
