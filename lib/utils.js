'use strict';

class Utils {

  /**
   * Used to normalize keys of mixed array and dot-separated string to a single array of undotted strings.
   *
   * @param {string|Array} rest (dot-separated) string(s) or array of keys
   *
   * @return {Array} The key normalized to an array of simple strings
   */
  static normalizeKey(rest) {
    rest           = Array.isArray(rest) ? rest : Array.prototype.slice.call(arguments);  //eslint-disable-line prefer-rest-params
    let key        = rest.shift();
    let normalized = Array.isArray(key) ? Utils.normalizeKey(key) : key.split('.');

    return rest.length === 0 ? normalized : normalized.concat(Utils.normalizeKey(rest));
  }

  /**
   * Check if `target` is a Plain ol' Javascript Object.
   *
   * @param {*} target
   *
   * @return {boolean}
   */
  static isPojo(target) {
    return !(target === null || typeof target !== 'object') && target.constructor === Object;
  }
}

module.exports = Utils;
