'use strict';

const {alt, map} = require('..');

/**

### Alt

1. `a.alt(b).alt(c)` is equivalent to `a.alt(b.alt(c))` (associativity)
2. `a.alt(b).map(f)` is equivalent to `a.map(f).alt(b.map(f))` (distributivity)

**/

const associativity = eq => a => b => c => eq(
  a[alt](b)[alt](c),
  a[alt](b[alt](c))
);

const distributivity = eq => a => b => f => eq(
  a[alt](b)[map](f),
  a[map](f)[alt](b[map](f))
);

module.exports = {associativity, distributivity};
