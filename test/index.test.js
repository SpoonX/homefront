"use strict";

let fs        = require('fs');
let assert    = require('chai').assert;
let flat      = require('./resources/flat.json');
let extend    = require('extend');
let nested    = require('./resources/nested.json');
let Homefront = require('../index.js').Homefront;

describe('Homefront', () => {

  describe('.constructor()', () => {
    it("Should create a new instance with a flat object.", () => {
      let homefront = new Homefront(flat);

      assert.deepEqual(homefront.data, flat, 'Object was not assigned properly.');
    });

    it("Should create a new instance with a nested object.", () => {
      let homefront = new Homefront(nested);

      assert.deepEqual(homefront.data, nested, 'Object was not assigned properly.');
    });

    it('Should create a new instance with an empty object.', () => {
      let homefront = new Homefront({});

      assert.deepEqual(homefront.data, {}, 'Object was not assigned properly.');
    });

    it('Should expose constant MODE_FLAT.', () => {
      assert.equal(Homefront.MODE_FLAT, 'flat', 'Mode not exposed properly.');
    });

    it('Should expose constant MODE_NESTED.', () => {
      assert.equal(Homefront.MODE_NESTED, 'nested', 'Mode not exposed properly.');
    });

    it('Should have mode set as "nested" by default.', () => {
      let homefront = new Homefront({});

      assert.strictEqual(homefront.mode, Homefront.MODE_NESTED, 'Mode does not default to nested.');
    });

    it('Should accept mode as second argument.', () => {
      let homefront = new Homefront({}, Homefront.MODE_FLAT);

      assert.strictEqual(homefront.mode, 'flat', 'It did not accept or assign mode.');
    });
  });

  describe('.setMode()', () => {
    it('Should have mode set to nested by default.', () => {
      let homefront = new Homefront({});

      assert.strictEqual(homefront.mode, Homefront.MODE_NESTED, 'It did not set mode "nested" by default.');
    });

    it('Should set mode to flat.', () => {
      let homefront = new Homefront({});

      homefront.setMode(Homefront.MODE_FLAT);

      assert.strictEqual(homefront.mode, 'flat', 'It did not set the mode to flat.');
    });

    it('Should set mode to nested.', () => {
      let homefront = new Homefront({});

      homefront.setMode(Homefront.MODE_NESTED);

      assert.strictEqual(homefront.mode, 'nested', 'It did not set the mode to nested.');
    });

    it('Should return error if mode is invalid.', () => {
      let homefront = new Homefront({});

      assert.throws(() => {
        homefront.setMode('single');
      }, Error);
    });
  });

  describe('.getMode()', () => {
    it('Should return "flat" when getting the mode of a flat object.', () => {
      let homefront = new Homefront({}, Homefront.MODE_FLAT);

      assert.strictEqual(homefront.getMode(), 'flat', 'It did not return what we expected.');
    });

    it('Should return "nested" when getting the mode of a nested object.', () => {
      let homefront = new Homefront({}, Homefront.MODE_NESTED);

      assert.strictEqual(homefront.getMode(), 'nested', 'It did not return what we expected.');
    });
  });

  describe('.expand()', () => {
    it('Should expand flat object.', () => {
      let homefront = new Homefront(flat, Homefront.MODE_FLAT);

      assert.deepEqual(homefront.expand(), nested, 'It did not expand object.');
    });

    it('Should return data untouched if the object is already nested.', () => {
      let homefront = new Homefront(nested, Homefront.MODE_NESTED);

      assert.strictEqual(homefront.expand(), nested, 'It did not return the object.');
    });
  });

  describe('.flatten()', () => {
    it('Should flatten nested object.', () => {
      let homefront = new Homefront(nested, Homefront.MODE_NESTED);

      assert.deepEqual(homefront.flatten(), flat, 'It did not flatten object.');
    });

    it('Should return data untouched if object is already flat.', () => {
      let homefront = new Homefront(flat, Homefront.MODE_FLAT);

      assert.strictEqual(homefront.flatten(), flat, 'It did not return the object.');
    });
  });

  describe('.isModeFlat()', () => {
    it("Should return `true` if the instance's mode is set to flat.", () => {
      let homefront = new Homefront({}, Homefront.MODE_FLAT);

      assert.strictEqual(homefront.isModeFlat(), true, 'It does not return true.');
    });

    it("Should return `false` if the instance's mode is set to nested.", () => {
      let homefront = new Homefront({}, Homefront.MODE_NESTED);

      assert.strictEqual(homefront.isModeFlat(), false, 'It does not return false.');
    });
  });

  describe('.isModeNested()', () => {
    it("Should return `true` if the object's mode is set to nested.", () => {
      let homefront = new Homefront({}, Homefront.MODE_NESTED);

      assert.strictEqual(homefront.isModeNested(), true, 'It does not return true.');
    });

    it("Should return `false` if the object's mode is set to flat.", () => {
      let homefront = new Homefront({}, Homefront.MODE_FLAT);

      assert.strictEqual(homefront.isModeNested(), false, 'It does not return true.');
    });
  });

  describe('.fetchOrPut()', () => {
    it('Should return the value that was passed via toPut.', () => {
      let homefront = new Homefront();
      let toPut     = {thing: 'value'};

      assert.deepEqual(homefront.fetchOrPut('walk.in.the.park', toPut), toPut);
    });

    it('Should return the value found, after calling fetchOrPut with the same key before.', () => {
      let homefront = new Homefront();
      let toPut     = {thing: 'value'};

      assert.deepEqual(homefront.fetchOrPut('walk.in.the.park', toPut), toPut);
      assert.deepEqual(homefront.fetch('walk.in.the.park', toPut), toPut);
    });
  });

  describe('.fetch()', () => {
    it("Should return value of given key in a nested instance.", () => {
      let homefront = new Homefront({food: {bacon: {taste: 'good'}}});

      assert.strictEqual(homefront.fetch('food.bacon.taste'), homefront.data.food.bacon.taste, 'Values do not match.');
    });

    it("Should return 'null' if the intance's mode is flat.", () => {
      let homefront = new Homefront({"food.bacon.taste": 'good'}, Homefront.MODE_FLAT);

      assert.isNull(homefront.fetch('food.bacon'), 'It did not return "null"');
    });

    it("Should return provided default value if not found.", () => {
      let homefront = new Homefront();

      assert.strictEqual(homefront.fetch('food.bacon', 'I am default'), 'I am default');
    });

    it("Should not return if last segment of key matches.", () => {
      let homefront = new Homefront({foo: 'bar'});

      assert.strictEqual(homefront.fetch('food.bacon.foo'), null);
    });

    it("Should function well for arrays.", () => {
      let homefront = new Homefront({foo: ['bar', 'bat']}, Homefront.MODE_FLAT);

      assert.isNull(homefront.fetch('foo.0'), 'bar');
      assert.isNull(homefront.fetch('foo.1'), 'bat');
      assert.isNull(homefront.fetch('foo.2'), null);
    });

    it("Should return 'null' if the key is invalid.", () => {
      let homefront = new Homefront({food: {bacon: {taste: 'good'}}});

      assert.isNull(homefront.fetch('food.apple'), 'It did not return "null".');
      assert.isNull(homefront.fetch('food.apple.going.deeper'), 'It did not return "null".');
    });

    it("Should return null if key doest exist.", () => {
      let homefront = new Homefront({food: null});

      assert.strictEqual(homefront.fetch('food.bacon'), null, 'Values do not match.');
    });

    it("Should return null if nested key doesn't exist.", () => {
      let homefront = new Homefront({food: null});

      assert.strictEqual(homefront.fetch('food.bacon.foo'), null, 'Values do not match.');
    });

    it("Should return the default value if key doesn't exist.", () => {
      let homefront = new Homefront({food: null});

      assert.strictEqual(homefront.fetch('food.bacon.foo', 'default'), 'default', 'Values do not match.');
    });
  });

  describe('static .merge()', () => {
    it('Should merge together two objects.', () => {
      let result = Homefront.merge(
        {foo: 'bar', cake: {walk: 1}},
        {foo: 'bat', cake: {tastes: 'good'}},
        {cake: {but: 'so does bacon'}, lies: true}
      );

      assert.deepEqual(result, {
        foo : 'bat',
        cake: {
          walk  : 1,
          tastes: 'good',
          but   : 'so does bacon'
        },
        lies: true
      });
    });
  });

  describe('.merge()', () => {
    it('Should properly merge in data, converting flat to nested.', () => {
      let homefront = new Homefront(Object.assign({}, nested), Homefront.MODE_NESTED);

      let expected = {};
      let v        = {'bat.what.do.you.want': 'stuff'};
      let w        = {'bat.space': 'exploration'};
      let x        = {foo: 'kak', bat: {cake: 'lies', what: {test: 'is this'}}};
      let y        = {bat: {cake: 'promise!', ja: 'man'}, meh: 'wut'};
      let z        = {foo: 'bar', bat: {baz: 'bacon'}};

      homefront.merge(v, w, x, y, z);

      assert.strictEqual(homefront.data.bat.what.test, 'is this', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data.bat.what.do.you.want, 'stuff', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data.bat.space, 'exploration', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data.bat.cake, 'promise!', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data.bat.ja, 'man', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data.foo, 'bar', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data.food.bacon.taste, 'good', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data.cake, 'lie', 'Merge did not work as expected.');
    });

    it('Should merge homefront instances.', () => {
      let homefront    = new Homefront({foo: 'bar', bacon: 'cake'});
      let homefrontTwo = new Homefront({foo: 'barz', topical: 'maybe'});

      assert.strictEqual(homefront.merge(homefrontTwo), homefront);
      assert.strictEqual(homefront.fetch('foo'), 'barz');
      assert.strictEqual(homefront.fetch('bacon'), 'cake');
      assert.strictEqual(homefront.fetch('topical'), 'maybe');
    });

    it('Should properly merge in data, converting nested to flat.', () => {
      let homefront = new Homefront(Object.assign({}, flat), Homefront.MODE_FLAT);

      let expected = {};
      let v        = {'bat.what.do.you.want': 'stuff'};
      let w        = {'bat.space': 'exploration'};
      let x        = {foo: 'kak', bat: {cake: 'lies', what: {test: 'is this'}}};
      let y        = {bat: {cake: 'promise!', ja: 'man'}, meh: 'wut'};
      let z        = {foo: 'bar', bat: {baz: 'bacon'}};

      homefront.merge(v, w, x, y, z);

      assert.strictEqual(homefront.data['bat.what.test'], 'is this', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data['bat.what.do.you.want'], 'stuff', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data['bat.space'], 'exploration', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data['bat.cake'], 'promise!', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data['bat.ja'], 'man', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data['foo'], 'bar', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data['food.bacon.taste'], 'good', 'Merge did not work as expected.');
      assert.strictEqual(homefront.data['cake'], 'lie', 'Merge did not work as expected.');
    });

    it('Should not merge data when provided falsy value.', () => {
      let homefront = new Homefront({hello: 'world'});

      homefront.merge();
      assert.deepEqual(homefront.data, {hello: 'world'});
      homefront.merge(null);
      assert.deepEqual(homefront.data, {hello: 'world'});
    });

    it('Should return self.', () => {
      let homefront = new Homefront({hello: 'world'});

      assert.strictEqual(homefront.merge({how: 'are you doing'}), homefront, 'Merge did not return self.');
    });
  });

  describe('.applyDefaults()', () => {
    it("Should set the defaults (left to right) provided", () => {
      let homefront = new Homefront({foo: {bar: {bat: 'value', baz: 'value', deep: {also: 'works'}}}});

      homefront.applyDefaults('foo.bar', {
        bat  : 'never applied',
        cake : 'lies',
        bacon: 'Why not',
        baz  : 'Also ignored',
        deep : {
          also : 'not set',
          other: 'is set'
        }
      });

      assert.deepEqual(homefront.fetch('foo'), {
        bar: {
          bat  : 'value',
          cake : 'lies',
          bacon: 'Why not',
          baz  : 'value',
          deep : {
            also : 'works',
            other: 'is set'
          }
        }
      });
    });
  });

  describe('.put()', () => {
    it("Should put a new key and value in the nested intance's data.", () => {
      let homefront = new Homefront({food: {bacon: {}}});
      homefront.put('food.bacon.whatevs', 'ok');

      assert.deepProperty(homefront.data, 'food.bacon.whatevs', 'Key and value not set properly.');
    });

    it("Should put a new key and value in the flat instance's data.", () => {
      let homefront = new Homefront({"food.bacon.taste": 'good'}, Homefront.MODE_FLAT);
      homefront.put('food.bacon.whatevs', 'ok');

      assert.strictEqual(homefront.data['food.bacon.whatevs'], 'ok', 'Key and value not set properly.');
    });

    it("Should put keys that aren't nested.", () => {
      let homefront = new Homefront({food: {bacon: {}}});
      homefront.put('cake', 'lie');

      assert.strictEqual(homefront.data.cake, 'lie', "It does not return the instance's data.");
    });

    it("Should put keys that are nested but don't exist yet.", () => {
      let homefront = new Homefront({food: {bacon: {}}});
      homefront.put('a.b.c.d.e.f.g.h.i.l.k.j.m.n.o.p.q.r.s.t.u.v.w.x.y.z', 'boop');

      assert.strictEqual(homefront.data.a.b.c.d.e.f.g.h.i.l.k.j.m.n.o.p.q.r.s.t.u.v.w.x.y.z, 'boop');
    });

    it("Should return the modified instance's data.", () => {
      let homefront = new Homefront({food: {bacon: {}}});
      homefront.put('food.bacon.whatevs', 'ok');

      assert.strictEqual(homefront.data, homefront.data, "It does not return the instance's data.");
    });
  });

  describe('.remove()', () => {
    it("Should remove the given key from nested intance's data.", () => {
      let homefront = new Homefront({food: {bacon: {taste: 'good'}}});
      homefront.remove('food.bacon.taste');

      assert.notDeepProperty(homefront.data, 'food.bacon.taste', 'It did not remove the given key.');
    });

    it("Should return the modified instance's data.", () => {
      let homefront = new Homefront({food: {bacon: {taste: 'good'}}});

      assert.strictEqual(homefront.remove('food.bacon').data, homefront.data, 'It did not return the data.');
    });
  });

  describe('.search()', () => {
    it('Should return an array containing all matching values from flat data.', () => {
      let homefront = new Homefront({"food.bacon.taste": "good", "fruit.and.stuff": "avocado", "water": "meh"},
        Homefront.MODE_FLAT);
      let filtered  = [{key: "food.bacon.taste", value: "good"}, {key: "fruit.and.stuff", value: "avocado"}];

      assert.deepEqual(homefront.search('o'), filtered, 'It did not return a filtered object.');
    });

    it('Should return an array containing all matching values form nested data.', () => {
      let homefront = new Homefront({food: {bacon: {taste: 'good', smell: 'true'}}, fruit: 'avocado'});
      let filtered  = [{key: 'food.bacon.taste', value: 'good'}, {key: 'fruit', value: 'avocado'}];

      assert.deepEqual(homefront.search('o'), filtered, 'It did not return a filtered object.');
    });

    it('Should return an empty array if no match is found.', () => {
      let homefront = new Homefront({"food.bacon.taste": "good", "fruit.and.stuff": "avocado", "water": "meh"},
        Homefront.MODE_FLAT);

      assert.deepEqual(homefront.search('banana'), [], 'It did not return an empty object.');
    });

    it('Should return the whole array as value if it contains a match.', () => {
      let homefront = new Homefront({food: ['fries', 'pizza', 'babies'], fruit: ['avocado', 'apple']});
      let filtered  = [{key: 'food', value: ['fries', 'pizza', 'babies']}];

      assert.deepEqual(homefront.search('babies'), filtered, 'It did not return a filtered object.');
    });
  });
});
