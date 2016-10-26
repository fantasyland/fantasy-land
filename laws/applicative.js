'use strict';

const {of, ap} = require('..');

const identity = eq => (A, v) => {
  return eq(
    v[ap](A[of](x => x)),
    v
  );
}

const homomorphism = eq => (A, x, f) => {
  return eq(
    A[of](x)[ap](A[of](f)),
    A[of](f(x))
  );
}

const interchange = eq => (A, y, u) => {
  return eq(
    A[of](y)[ap](u),
    u[ap](A[of](f => f(y)))
  );
}

module.exports = {identity, homomorphism, interchange};
