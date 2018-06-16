'use strict';

const assert = require ('assert');

const FL = require ('..');


test ('exports', () => {
  assert.strictEqual (FL.map, 'fantasy-land/map');
});
