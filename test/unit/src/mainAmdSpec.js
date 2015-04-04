//// main.js unit tests for AMD deployment type

(function(global) {
'use strict';

describe('yllr (AMD):', function() {
  var globalNS = 'yllr';
  var moduleName = globalNS;

  it('should not be defined in global', function() {
    expect(global[globalNS]).not.toBeDefined();
  });

  it('should be defined as "' + moduleName + '" module', function(asyncDone) {
    // expect AMD test shims
    expect(global.require).toBeDefined();
    expect(global.define).toBeDefined();

    // do not expect CommonJS test shims
    expect(global.module).not.toBeDefined();
    expect(global.exports).not.toBeDefined();

    require([moduleName], function(yllr) { // load module
      expect(_.isPlainObject(yllr)).toEqual(true);
      expect(_.isFunction(yllr.YllrError)).toEqual(true);
      asyncDone();
    });
  });
});

})(this);
