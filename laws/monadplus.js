'use strict';

const {alt, chain} = require('..');

/**

### MonadPlus

1. `x.alt(y).chain(f)` is equivalent to `x.chain(f).alt(y.chain(f))` (distributivity)

**/

const distributivity = eq => x => y => f => eq(
  x[alt](y)[chain](f),
  x[chain](f)[alt](y[chain](f))
);

module.exports = {distributivity};
