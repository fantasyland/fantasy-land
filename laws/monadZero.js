'use strict';

const {pempty, chain} = require('..');

/**

### MonadZero

1. `M.pempty().chain(f)` is equivalent to `M.pempty()` (annihilation)

**/

const annihilation = T => eq => f => eq(
  T[pempty]()[chain](f),
  T[pempty]()
);

module.exports = {annihilation};
