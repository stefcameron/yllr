//// Shim for testing how the library loads in a CommonJS-like environment

(function(global) {
'use strict';

var __exports = {};

// Setup `module.exports` such that setting it results in `exports` being a
//  reference to the new value, but setting `exports` directly is not allowed,
//  though by default it's an object, the same as `module.exports`, on which
//  exported properties can be set.
// This should mimic the CommonJS behavior close enough.

global.module = {};
Object.defineProperty(global.module, 'exports', {
  enumerable: true,
  get: function() {
    return __exports;
  },
  set: function(newValue) {
    __exports = newValue;
  }
});

Object.defineProperty(global, 'exports', {
  enumerable: true,
  get: function() {
    return __exports;
  }
});

})(this);
