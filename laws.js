'use strict';

const {equals, concat, empty} = require('./');

module.exports = (T, eq) => ({


  // Unlike in other algebras in Setoind we don't use `eq`
  Setoid: {
    reflexivity(a) {
      return a[equals](a);
    },
    symmetry(a, b) {
      return a[equals](b) === b[equals](a);
    },
    transitivity(a, b, c) {
      return a[equals](b) && b[equals](c) ? a[equals](c) : true;
    },
  },


  Semigroup: {
    associativity(a, b, c) {
      return eq(
        a[concat](b)[concat](c),
        a[concat](b[concat](c))
      );
    },
  },


  Monoid: {
    rightIdentity(m) {
      return eq(
        m[concat](m.constructor[empty]()),
        m
      );
    },
    leftIdentity(m) {
      return eq(
        m.constructor[empty]()[concat](m),
        m
      );
    },
  },


});
