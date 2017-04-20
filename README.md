# homefront

[![Build Status](https://travis-ci.org/SpoonX/homefront.svg?branch=master)](https://travis-ci.org/SpoonX/homefront)

Merge, flatten, expand, search in, fetch from, remove from, put in and work with objects easily.

![Image unrelated](./homefront.jpg)

Makes working with javascript objects really easy, in both the browser and on the server.

## Installation

`npm i --save homefront`

## Tests

`npm test`

## Usage

Usage is pretty straight forward.

### Homefront class

#### Working with homefront

```js
let Homefront = require('homefront').Homefront;
let homefront = new Homefront(data, Homefront.MODE_NESTED);

// Put a value.
homefront.put('me', 'down');

// Fetch a value.
homefront.fetch('me', 'default value');

// Remove a value.
homefront.remove('me');

// Use dot-notation for nested objects.
homefront.put('user.profile.username', 'Frank');
homefront.fetch('user.profile.username');
homefront.fetchOrPut('user.profile.username', 'Francis');
homefront.remove('user.profile.username');

// Merge new data into your object
homefront.merge({override: 'something'}, {and: {add: {something: 'else'}}});

// And the same again, but with nested keys!
homefront.merge(
  {'no.way.this.is.not.possible': 'right?', 'you.are.wrong': 'It is'},
  {mind: 'blown'},
  new Homefront({andThis: 'also works'})
);

// And, sorry, the same again, but static.
Homefront.merge({foo: 'bar'}, {bat: 'baz'});

// And sort of the same, apply defaults.
homefront.defaults('you.are', {
  wrong : 'never set, because it already exists',
  right : 'applied because non-existent',
  nested: {also: 'works'}
});

// Flatten object (nested objects to dot-notation keys):
homefront.flatten();

// Expand object (dot-notation keys to nested objects):
homefront.expand();

// Helpers
homefront.isModeFlat();
homefront.isModeNested();
homefront.getMode();
homefront.setMode(Homefront.MODE_FLAT);

// Constants
Homefront.MODE_FLAT;
Homefront.MODE_NESTED;
```

### Expand

```js
let expand   = require('homefront').expand;
let data     = {'my.nested.key': 'value', 'my.nested.other': 'value'};
let expanded = expand(data); // => {my: {nested: {key: 'value', other: 'value'}}}
```

### Flatten

Returns a flattened object, with all nested keys dot separated.

```js
let flatten   = require('homefront').flatten;
let data      = {foo:{bar:{bat:'baz'}}};
let flattened = flatten(data); // => {'foo.bar.bat': 'baz'}
```

## Building the code

For this code to work in the browser, there's an extra transpile step included.
Running this is as easy as executing the following command:

`npm run build`

The built code will appear in the dist directory.

## Breaking changes

Since the last major version bump, method `.defaults()` has been renamed to `.applyDefaults()` as defaults cause exceptions on some browser. It shadows the name of a strict-mode function.
