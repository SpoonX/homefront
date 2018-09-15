/**
 * Expands flat object to nested object.
 *
 * @param {{}} source
 *
 * @return {{}}
 */
export declare function expand(source?:{}):{};

/**
 * Flattens nested object (dot separated keys).
 *
 * @param {{}}      source
 * @param {String}  [basePath]
 * @param {{}}      [target]
 *
 * @return {{}}
 */
export declare function flatten(source?:{}, basePath?:string, target?:{}):{};
/**
 * Object wrapping class.
 */
export declare class Homefront {

  /**
   * @return {string}
   */
  static MODE_NESTED:string;

  /**
   * @return {string}
   */
  static MODE_FLAT:string;

  /**
   * Constructs a new instance of Homefront.
   *
   * @param {{}}     [data]       Defaults to empty object.
   * @param {String} [mode]       Defaults to nested
   */
  constructor(data?:{}, mode?:string);

  /**
   * Recursively merges given sources into data.
   *
   * @param {{}[]} sources One or more, or array of, objects to merge into data (left to right).
   *
   * @return {Homefront}
   */
  merge(...sources:Array<{}|Homefront>):Homefront;

  /**
   * Static version of merge, allowing you to merge objects together.
   *
   * @param {...Object} sources One or more, or array of, objects to merge into data (left to right).
   *
   * @return {{}}
   */
  static merge(...sources:Array<{}|Homefront>):{};

  /**
   * Sets the mode.
   *
   * @param {String} [mode] Defaults to nested.
   *
   * @returns {Homefront} Fluent interface
   *
   * @throws {Error}
   */
  setMode(mode?:string):Homefront;

  /**
   * Gets the mode.
   *
   * @return {String}
   */
  getMode():string;

  /**
   * Get data object.
   *
   * @return {Object}
   */
  getData(): {};

  /**
   * Expands flat object to nested object.
   *
   * @return {{}}
   */
  expand(source?:{}):{};

  /**
   * Flattens nested object (dot separated keys).
   *
   * @return {{}}
   */
  flatten(source?:{}, basePath?:string, target?:{}):{};

  /**
   * Returns whether or not mode is flat.
   *
   * @return {boolean}
   */
  isModeFlat():boolean;

  /**
   * Returns whether or not mode is nested.
   *
   * @return {boolean}
   */
  isModeNested():boolean;

  /**
   * Convenience method. Calls .fetch(), and on null result calls .put() using provided toPut.
   *
   * @param {String|Array} key
   * @param {*}            toPut
   *
   * @return {*}
   */
  fetchOrPut(key:string, toPut:any):any;

  /**
   * Method allowing you to set missing keys (backwards-applied defaults) nested.
   *
   * @param {String|Array} key
   * @param {*}            defaults
   *
   * @returns {Homefront}
   */
  applyDefaults(key?:string, defaults?:any):any;

  /**
   * Fetches value of given key.
   *
   * @param {String|Array} key
   * @param {*}            [defaultValue] Value to return if key was not found
   *
   * @returns {*}
   */
  fetch(key?:string, defaultValue?:any):any;

  /**
   * Sets value for a key.
   *
   * @param {String|Array} key    Array of key parts, or dot separated key.
   * @param {*}            value
   *
   * @returns {Homefront}
   */
  put(key?:string | Array<string>, value?:any):Homefront;

  /**
   * Removes value by key.
   *
   * @param {String} key
   *
   * @returns {Homefront}
   */
  remove(key?:string):Homefront;

  /**
   * Search and return keys and values that match given string.
   *
   * @param {String|Number} phrase
   *
   * @returns {Array}
   */
  search(phrase?:string | number):Array<any>;
}
export declare class Utils {

  /**
   * Used to normalize keys of mixed array and dot-separated string to a single array of undotted strings.
   *
   * @param {string|Array} rest (dot-separated) string(s) or array of keys
   *
   * @return {Array} The key normalized to an array of simple strings
   */
  static normalizeKey(...rest:Array<string|Array<any>>):Array<string>;

  /**
   * Check if `target` is a Plain ol' Javascript Object.
   *
   * @param {*} target
   *
   * @return {boolean}
   */
  static isPojo(target:any):boolean;
}
