(function() {

  'use strict';

  var mapping = {
    equals: 'fantasy-land/equals',
    lte: 'fantasy-land/lte',
    compose: 'fantasy-land/compose',
    id: 'fantasy-land/id',
    concat: 'fantasy-land/concat',
    empty: 'fantasy-land/empty',
    invert: 'fantasy-land/invert',
    filter: 'fantasy-land/filter',
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

  /* istanbul ignore else */
  if (
    typeof module === 'object' &&
    module != null &&
    typeof module.exports === 'object'
  ) {
    module.exports = mapping;
  } else {
    globalThis.FantasyLand = mapping;
  }

} ());
