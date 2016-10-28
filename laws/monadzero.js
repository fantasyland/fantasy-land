'use strict';

const {zero, chain} = require('..');

/**

### MonadZero

1. `M.zero().chain(f)` is equivalent to `M.zero()` (annihilation)

**/

const annihilation = T => eq => f => eq(
  T[zero]()[chain](f),
  T[zero]()
);

module.exports = {annihilation};
