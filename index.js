/* eslint-disable max-lines */

'use strict';

const extend      = require('extend');
const expand      = require('./lib/expand');
const Utils       = require('./lib/utils');
const flatten     = require('./lib/flatten');
const MODE_FLAT   = 'flat';
const MODE_NESTED = 'nested';
const MODES       = [MODE_FLAT, MODE_NESTED];

/**
 * Object wrapping class.
 */
class Homefront {

  /**
   * @return {string}
   */
  static get MODE_NESTED() {
    return MODE_NESTED;
  }

  /**
   * @return {string}
   */
  static get MODE_FLAT() {
    return MODE_FLAT;
  }

  /**
   * Constructs a new instance of Homefront.
   *
   * @param {{}}     [data]       Defaults to empty object.
   * @param {String} [mode]       Defaults to nested
   */
  constructor(data, mode) {
    this.data = data || {};

    this.setMode(mode);
  }

  /**
   * Recursively merges given sources into data.
   *
   * @param {...Object} sources One or more, or array of, objects to merge into data (left to right).
   *
   * @return {Homefront}
   */
  merge(sources) {
    sources       = Array.isArray(sources) ? sources : Array.prototype.slice.call(arguments); //eslint-disable-line prefer-rest-params
    let mergeData = [];

    sources.forEach(source => {
      if (!source) {
        return;
      }

      if (source instanceof Homefront) {
        source = source.data;
      }

      mergeData.push(this.isModeFlat() ? flatten(source) : expand(source));
    });

    extend.apply(extend, [true, this.data].concat(mergeData));

    return this;
  }

  /**
   * Static version of merge, allowing you to merge objects together.
   *
   * @param {...Object} sources One or more, or array of, objects to merge (left to right).
   *
   * @return {{}}
   */
  static merge(sources) {
    sources = Array.isArray(sources) ? sources : Array.prototype.slice.call(arguments); //eslint-disable-line prefer-rest-params

    return extend.apply(extend, [true].concat(sources));
  }

  /**
   * Sets the mode.
   *
   * @param {String} [mode] Defaults to nested.
   *
   * @returns {Homefront} Fluent interface
   *
   * @throws {Error}
   */
  setMode(mode) {
    mode = mode || MODE_NESTED;

    if (MODES.indexOf(mode) === -1) {
      throw new Error(
        `Invalid mode supplied. Must be one of "${MODES.join('" or "')}"`
      );
    }

    this.mode = mode;

    return this;
  }

  /**
   * Gets the mode.
   *
   * @return {String}
   */
  getMode() {
    return this.mode;
  }

  /**
   * Get data object.
   *
   * @return {Object}
   */
  getData() {
    return this.data;
  }

  /**
   * Expands flat object to nested object.
   *
   * @return {{}}
   */
  expand() {
    return this.isModeNested() ? this.data : expand(this.data);
  }

  /**
   * Flattens nested object (dot separated keys).
   *
   * @return {{}}
   */
  flatten() {
    return this.isModeFlat() ? this.data : flatten(this.data);
  }

  /**
   * Returns whether or not mode is flat.
   *
   * @return {boolean}
   */
  isModeFlat() {
    return this.mode === MODE_FLAT;
  }

  /**
   * Returns whether or not mode is nested.
   *
   * @return {boolean}
   */
  isModeNested() {
    return this.mode === MODE_NESTED;
  }

  /**
   * Method allowing you to set missing keys (backwards-applied defaults) nested.
   *
   * @param {String|Array} key
   * @param {*}            defaults
   *
   * @returns {Homefront}
   */
  applyDefaults(key, defaults) {
    return this.put(key, Homefront.merge(defaults, this.fetch(key, {})));
  }

  /**
   * Convenience method. Calls .fetch(), and on null result calls .put() using provided toPut.
   *
   * @param {String|Array} key
   * @param {*}            toPut
   *
   * @return {*}
   */
  fetchOrPut(key, toPut) {
    let wanted = this.fetch(key);

    if (wanted === null) {
      wanted = toPut;

      this.put(key, toPut);
    }

    return wanted;
  }

  /**
   * Fetches value of given key.
   *
   * @param {String|Array} key
   * @param {*}            [defaultValue] Value to return if key was not found
   *
   * @returns {*}
   */
  fetch(key, defaultValue) {
    defaultValue = typeof defaultValue === 'undefined' ? null : defaultValue;

    if (typeof this.data[key] !== 'undefined') {
      return this.data[key];
    }

    if (this.isModeFlat()) {
      return defaultValue;
    }

    let keys    = Utils.normalizeKey(key);
    let lastKey = keys.pop();
    let tmp     = this.data;

    for (let i = 0; i < keys.length; i += 1) {
      if (typeof tmp[keys[i]] === 'undefined' || tmp[keys[i]] === null) {
        return defaultValue;
      }

      tmp = tmp[keys[i]];
    }

    return typeof tmp[lastKey] === 'undefined' ? defaultValue : tmp[lastKey];
  }

  /**
   * Sets value for a key (creates object in path when not found).
   *
   * @param {String|Array} key    Array of key parts, or dot separated key.
   * @param {*}            value
   *
   * @returns {Homefront}
   */
  put(key, value) {
    if (this.isModeFlat() || key.indexOf('.') === -1) {
      this.data[key] = value;

      return this;
    }

    let keys    = Utils.normalizeKey(key);
    let lastKey = keys.pop();
    let tmp     = this.data;

    keys.forEach(val => {
      if (typeof tmp[val] === 'undefined') {
        tmp[val] = {};
      }

      tmp = tmp[val];
    });

    tmp[lastKey] = value;

    return this;
  }

  /**
   * Removes value by key.
   *
   * @param {String} key
   *
   * @returns {Homefront}
   */
  remove(key) {
    if (this.isModeFlat() || key.indexOf('.') === -1) {
      delete this.data[key];

      return this;
    }

    let normalizedKey = Utils.normalizeKey(key);
    let lastKey       = normalizedKey.pop();
    let source        = this.fetch(normalizedKey);

    if (typeof source === 'object' && source !== null) {
      delete source[lastKey];
    }

    return this;
  }

  /**
   * Search and return keys and values that match given string.
   *
   * @param {String|Number} phrase
   *
   * @returns {Array}
   */
  search(phrase) {
    let found = [];
    let data  = this.data;

    if (this.isModeNested()) {
      data = flatten(this.data);
    }

    Object.getOwnPropertyNames(data).forEach(key => {
      let searchTarget = Array.isArray(data[key]) ? JSON.stringify(data[key]) : data[key];

      if (searchTarget.search(phrase) > -1) {
        found.push({key: key, value: data[key]});
      }
    });

    return found;
  }
}

module.exports.flatten   = flatten;
module.exports.expand    = expand;
module.exports.Utils     = Utils;
module.exports.Homefront = Homefront;
