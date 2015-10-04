//// main.js unit tests for AMD deployment type

(function(global) {
'use strict';

describe('yllr (AMD):', function() {
  var globalNS = 'yllr';

  it('should not be defined in global', function() {
    expect(global[globalNS]).not.toBeDefined();
  });

  it('should have exported itself to module.exports', function() {
    var yllr;

    // do not expect AMD test shims
    expect(global.require).not.toBeDefined();
    expect(global.define).not.toBeDefined();

    // expect CommonJS test shims
    expect(global.module).toBeDefined();
    expect(global.exports).toBeDefined();
    expect(_.isObject(global.module)).toEqual(true);
    expect(global.module.exports).toBeDefined();
    expect(global.exports).toEqual(global.module.exports);

    yllr = global.module.exports;

    // module.exports value should be the library itself
    expect(_.isPlainObject(yllr)).toEqual(true);
    expect(_.isFunction(yllr.YllrError)).toEqual(true);
  });

  it('should not include yllr.config.noConflict()', function() {
    var yllr = global.module.exports;

    expect(yllr.config.noConflict).toEqual(undefined);
  });
});

})(this);
