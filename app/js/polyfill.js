/**
 * A simple polyfill because I can't figure out a good way to package 6to5 files
 * without this file for addons.
 */

// Required because 6to5 tacks things onto an exports object
// which will throw an error if it doesn't exist.
/* exported exports */
var exports = {};
