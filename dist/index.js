/* eslint-disable max-lines */

'use strict';

var extend      = require('extend');
var expand      = require('./lib/expand');
var Utils       = require('./lib/utils');
var flatten     = require('./lib/flatten');
var MODE_FLAT   = 'flat';
var MODE_NESTED = 'nested';
var MODES       = [MODE_FLAT, MODE_NESTED];

/**
 * Object wrapping class.
 */
var Homefront = function Homefront(data, mode) {
  this.data = data || {};

  this.setMode(mode);
};

var staticAccessors = { MODE_NESTED: {},MODE_FLAT: {} };

/**
 * Recursively merges given sources into data.
 *
 * @param {...Object} sources One or more, or array of, objects to merge into data (left to right).
 *
 * @return {Homefront}
 */
staticAccessors.MODE_NESTED.get = function () {
  return MODE_NESTED;
};

/**
 * @return {string}
 */
staticAccessors.MODE_FLAT.get = function () {
  return MODE_FLAT;
};

Homefront.prototype.merge = function merge (sources) {
    var this$1 = this;

  sources     = Array.isArray(sources) ? sources : Array.prototype.slice.call(arguments); //eslint-disable-line prefer-rest-params
  var mergeData = [];

  sources.forEach(function (source) {
    if (!source) {
      return;
    }

    if (source instanceof Homefront) {
      source = source.data;
    }

    mergeData.push(this$1.isModeFlat() ? flatten(source) : expand(source));
  });

  extend.apply(extend, [true, this.data].concat(mergeData));

  return this;
};

/**
 * Static version of merge, allowing you to merge objects together.
 *
 * @param {...Object} sources One or more, or array of, objects to merge (left to right).
 *
 * @return {{}}
 */
Homefront.merge = function merge (sources) {
  sources = Array.isArray(sources) ? sources : Array.prototype.slice.call(arguments); //eslint-disable-line prefer-rest-params

  return extend.apply(extend, [true].concat(sources));
};

/**
 * Sets the mode.
 *
 * @param {String} [mode] Defaults to nested.
 *
 * @returns {Homefront} Fluent interface
 *
 * @throws {Error}
 */
Homefront.prototype.setMode = function setMode (mode) {
  mode = mode || MODE_NESTED;

  if (MODES.indexOf(mode) === -1) {
    throw new Error(
      ("Invalid mode supplied. Must be one of \"" + (MODES.join('" or "')) + "\"")
    );
  }

  this.mode = mode;

  return this;
};

/**
 * Gets the mode.
 *
 * @return {String}
 */
Homefront.prototype.getMode = function getMode () {
  return this.mode;
};

/**
 * Get data object.
 *
 * @return {Object}
 */
Homefront.prototype.getData = function getData () {
  return this.data;
};

/**
 * Expands flat object to nested object.
 *
 * @return {{}}
 */
Homefront.prototype.expand = function expand$1 () {
  return this.isModeNested() ? this.data : expand(this.data);
};

/**
 * Flattens nested object (dot separated keys).
 *
 * @return {{}}
 */
Homefront.prototype.flatten = function flatten$1 () {
  return this.isModeFlat() ? this.data : flatten(this.data);
};

/**
 * Returns whether or not mode is flat.
 *
 * @return {boolean}
 */
Homefront.prototype.isModeFlat = function isModeFlat () {
  return this.mode === MODE_FLAT;
};

/**
 * Returns whether or not mode is nested.
 *
 * @return {boolean}
 */
Homefront.prototype.isModeNested = function isModeNested () {
  return this.mode === MODE_NESTED;
};

/**
 * Method allowing you to set missing keys (backwards-applied defaults) nested.
 *
 * @param {String|Array} key
 * @param {*}          defaults
 *
 * @returns {Homefront}
 */
Homefront.prototype.applyDefaults = function applyDefaults (key, defaults) {
  return this.put(key, Homefront.merge(defaults, this.fetch(key, {})));
};

/**
 * Convenience method. Calls .fetch(), and on null result calls .put() using provided toPut.
 *
 * @param {String|Array} key
 * @param {*}          toPut
 *
 * @return {*}
 */
Homefront.prototype.fetchOrPut = function fetchOrPut (key, toPut) {
  var wanted = this.fetch(key);

  if (wanted === null) {
    wanted = toPut;

    this.put(key, toPut);
  }

  return wanted;
};

/**
 * Fetches value of given key.
 *
 * @param {String|Array} key
 * @param {*}          [defaultValue] Value to return if key was not found
 *
 * @returns {*}
 */
Homefront.prototype.fetch = function fetch (key, defaultValue) {
  defaultValue = typeof defaultValue === 'undefined' ? null : defaultValue;

  if (typeof this.data[key] !== 'undefined') {
    return this.data[key];
  }

  if (this.isModeFlat()) {
    return defaultValue;
  }

  var keys  = Utils.normalizeKey(key);
  var lastKey = keys.pop();
  var tmp   = this.data;

  for (var i = 0; i < keys.length; i += 1) {
    if (typeof tmp[keys[i]] === 'undefined' || tmp[keys[i]] === null) {
      return defaultValue;
    }

    tmp = tmp[keys[i]];
  }

  return typeof tmp[lastKey] === 'undefined' ? defaultValue : tmp[lastKey];
};

/**
 * Sets value for a key (creates object in path when not found).
 *
 * @param {String|Array} key  Array of key parts, or dot separated key.
 * @param {*}            value
   *
   * @returns {Homefront}
 */
Homefront.prototype.put = function put (key, value) {
  if (this.isModeFlat() || key.indexOf('.') === -1) {
    this.data[key] = value;

    return this;
  }

  var keys  = Utils.normalizeKey(key);
  var lastKey = keys.pop();
  var tmp   = this.data;

  keys.forEach(function (val) {
    if (typeof tmp[val] === 'undefined') {
      tmp[val] = {};
    }

    tmp = tmp[val];
  });

  tmp[lastKey] = value;

  return this;
};

/**
 * Removes value by key.
 *
 * @param {String} key
 *
 * @returns {Homefront}
 */
Homefront.prototype.remove = function remove (key) {
  if (this.isModeFlat() || key.indexOf('.') === -1) {
    delete this.data[key];

    return this;
  }

  var normalizedKey = Utils.normalizeKey(key);
  var lastKey     = normalizedKey.pop();
  var source      = this.fetch(normalizedKey);

  if (typeof source === 'object' && source !== null) {
    delete source[lastKey];
  }

  return this;
};

/**
 * Search and return keys and values that match given string.
 *
 * @param {String|Number} phrase
 *
 * @returns {Array}
 */
Homefront.prototype.search = function search (phrase) {
  var found = [];
  var data= this.data;

  if (this.isModeNested()) {
    data = flatten(this.data);
  }

  Object.getOwnPropertyNames(data).forEach(function (key) {
    var searchTarget = Array.isArray(data[key]) ? JSON.stringify(data[key]) : data[key];

    if (searchTarget.search(phrase) > -1) {
      found.push({key: key, value: data[key]});
    }
  });

  return found;
};

Object.defineProperties( Homefront, staticAccessors );

module.exports.flatten   = flatten;
module.exports.expand    = expand;
module.exports.Utils     = Utils;
module.exports.Homefront = Homefront;
