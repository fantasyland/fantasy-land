'use strict';

const {lte, equals} = require('..');

/**
   ### Ord

   1. `a.lte(b)` or `b.lte(a)` (totality)
   2. If `a.lte(b)` and `b.lte(a)`, then `a.equals(b)` (antisymmetry)
   3. If `a.lte(b)` and `b.lte(c)`, then `a.lte(c)` (transitivity)

**/

const totality = eq => f => g => {
  const a = f[lte](g);
  const b = g[lte](f);
  const c = true;
  return eq(a || b, c);
};

const antisymmetry = eq => f => g => {
  const a = f[lte](g);
  const b = g[lte](f);
  const c = f[equals](g);
  const d = true;
  return eq(a, d) && eq(b, d) && eq(c, d);
};

const transitivity = eq => f => g => h => {
  const a = f[lte](g);
  const b = g[lte](h);
  const c = f[lte](h);
  const d = true;
  return eq(a, d) && eq(b, d) && eq(c, d);
};

module.exports = {totality, antisymmetry, transitivity};
