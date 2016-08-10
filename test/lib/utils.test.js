"use strict";

let assert = require('chai').assert;
let Utils  = require('../../lib/utils');

describe('Utils', () => {
  describe('static .normalizeKey()', () => {
    it('Should properly normalize given key.', () => {
      let weirdKeyOne   = 'some.stupid.idea';
      let weirdKeyTwo   = 'maybe';
      let weirdKeyThree = '.';
      let weirdKeyFour  = ['I', 'should', 'give', 'up'];
      let weirdKeyFive  = '';

      assert.deepEqual(Utils.normalizeKey(weirdKeyOne), ['some', 'stupid', 'idea'], 'Unexpected key.');
      assert.deepEqual(Utils.normalizeKey(weirdKeyTwo), ['maybe'], 'Unexpected key.');
      assert.deepEqual(Utils.normalizeKey(weirdKeyThree), ['', ''], 'Unexpected key.');
      assert.deepEqual(Utils.normalizeKey(weirdKeyFour), ['I', 'should', 'give', 'up'], 'Unexpected key.');
      assert.deepEqual(Utils.normalizeKey(weirdKeyFive), [''], 'Unexpected key.');
    });
  });

  describe('static .isPojo()', () => {
    it('Should detect is given value is a pojo', () => {
      assert.isTrue(Utils.isPojo({}));
      assert.isTrue(Utils.isPojo({foo: 'bar'}));
      assert.isTrue(Utils.isPojo(Object.create({})));
      assert.isFalse(Utils.isPojo(null));
      assert.isFalse(Utils.isPojo(undefined));
      assert.isFalse(Utils.isPojo('foo'));
      assert.isFalse(Utils.isPojo(1337));
      assert.isFalse(Utils.isPojo(123.45));
      assert.isFalse(Utils.isPojo(true));
      assert.isFalse(Utils.isPojo(false));
      assert.isFalse(Utils.isPojo(NaN));
      assert.isFalse(Utils.isPojo([]));
      assert.isFalse(Utils.isPojo(Array));
      assert.isFalse(Utils.isPojo(Array.prototype));
    });
  });
});
