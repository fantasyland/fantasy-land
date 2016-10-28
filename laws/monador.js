'use strict';

const {of, alt} = require('..');

/**

### MonadOr

1. `M.of(a).alt(b)` is equivalent to `M.of(a)` (left catch)

**/

const leftCatch = T => eq => a => b => eq(
  T[of](a)[alt](b),
  T[of](a)
);

module.exports = {leftCatch};
