'use strict';

const {identity, compose} = require('fantasy-combinators');
const {of, map, ap} = require('..');

/**

### Apply

1. `v.ap(u.ap(a.map(f => g => x => f(g(x)))))` is equivalent to `v.ap(u).ap(a)` (composition)

**/

const composition = t => eq => x => {
  const y = t[of](identity);

  const a = y[ap](y[ap](y[map](compose)));
  const b = y[ap](y)[ap](y);
  return eq(a, b);
};

module.exports = {composition};
