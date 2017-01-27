'use strict';

var Utils = function Utils () {};

Utils.normalizeKey = function normalizeKey (rest) {
  rest         = Array.isArray(rest) ? rest : Array.prototype.slice.call(arguments);//eslint-disable-line prefer-rest-params
  var key      = rest.shift();
  var normalized = Array.isArray(key) ? Utils.normalizeKey(key) : key.split('.');

  return rest.length === 0 ? normalized : normalized.concat(Utils.normalizeKey(rest));
};

/**
 * Check if `target` is a Plain ol' Javascript Object.
 *
 * @param {*} target
 *
 * @return {boolean}
 */
Utils.isPojo = function isPojo (target) {
  return !(target === null || typeof target !== 'object') && target.constructor === Object;
};

module.exports = Utils;
