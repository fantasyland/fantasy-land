(function() {

  'use strict';

  /* eslint comma-dangle: ["off"], no-var: ["off"], strict: ["error", "function"] */
  /* global self */

  var mapping = {
    equals: 'fantasy-land/equals',
    lte: 'fantasy-land/lte',
    compose: 'fantasy-land/compose',
    id: 'fantasy-land/id',
    concat: 'fantasy-land/concat',
    empty: 'fantasy-land/empty',
    map: 'fantasy-land/map',
    contramap: 'fantasy-land/contramap',
    ap: 'fantasy-land/ap',
    of: 'fantasy-land/of',
    alt: 'fantasy-land/alt',
    zero: 'fantasy-land/zero',
    reduce: 'fantasy-land/reduce',
    traverse: 'fantasy-land/traverse',
    chain: 'fantasy-land/chain',
    chainRec: 'fantasy-land/chainRec',
    extend: 'fantasy-land/extend',
    extract: 'fantasy-land/extract',
    bimap: 'fantasy-land/bimap',
    promap: 'fantasy-land/promap'
  };

  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = mapping;
  } else {
    self.FantasyLand = mapping;
  }

}());
