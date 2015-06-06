//// main.js unit tests for global deployment type

(function(global) {
'use strict';

var globalNS = 'yllr';

describe('yllr (global):', function() {
  it('should be defined as "' + globalNS + '" in global', function() {
    expect(_.isPlainObject(global[globalNS])).toEqual(true);
  });

  describe('library:', function() {
    var yllr = global[globalNS];

    describe('types:', function() {
      describe('YllrError:', function() {
        var YllrError = yllr.YllrError;

        it('should be included', function() {
          expect(_.isFunction(YllrError)).toEqual(true);
        });

        it('should extend the JavaScript Error type', function() {
          var err = new YllrError();
          expect(err instanceof Error).toEqual(true);
        });

        it('should have the name "yllrError"', function() {
          var err = new YllrError();
          expect(err.name).toEqual('yllrError');
        });

        it('should take a message', function() {
          var err = new YllrError('foo');
          expect(err.message).toEqual('foo');
        });

        it('should replace optional tokens in the message', function() {
          var template = 'hello {0} {1}';
          var err;

          err = new YllrError(template);
          expect(err.message).toEqual(template); // no replacement

          err = new YllrError(template, []);
          expect(err.message).toEqual(template); // no tokens to use

          err = new YllrError(template, ['a']);
          expect(err.message).toEqual('hello a {1}'); // only {0} replaced

          err = new YllrError(template, ['a', 'b']);
          expect(err.message).toEqual('hello a b'); // all replaced

          err = new YllrError(template, ['a', 'b', 'c']);
          expect(err.message).toEqual('hello a b'); // extra tokens ignored

          // non-string tokens are converted to strings
          err = new YllrError(template, [1, {}]);
          expect(err.message).toEqual('hello 1 ' + {}.toString());

          // bad token list type
          expect(function() { new YllrError(template, {}); }).toThrow();
        });

        it('should replace empty string tokens with special string', function() {
          var err = new YllrError('{0}', ['']);
          expect(err.message).toEqual('<empty>');
        });
      }); // YllrError
    }); // types

    describe('functions:', function() {
      describe('check():', function() {
        var YllrError = yllr.YllrError;

        it('should be included', function() {
          expect(_.isFunction(yllr.check)).toEqual(true);
        });

        it('should not throw if condition is met', function() {
          expect(function() { yllr.check(true); }).not.toThrow();
        });

        it('should throw a YllrError with default message', function() {
          expect(function() { yllr.check(false); }).toThrow(
              new YllrError('runtime assertion'));
        });

        it('should throw a YllrError with check message', function() {
          expect(function() { yllr.check(false, 'must be true'); }).toThrow(
              new YllrError('must be true'));
        });

        it('should allow tokens in check message', function() {
          expect(function() { yllr.check(false, 'must be {0}', ['true']); })
              .toThrow(new YllrError('must be true'));
        });

        it('should allow non-array token in check message', function() {
          expect(function() { yllr.check(false, 'must be {0}', true); })
              .toThrow(new YllrError('must be true'));
        });

        it('should use rest params as tokens in check message', function() {
          expect(function() { yllr.check(false, '{0} {1} {2}', 'must', 'be', true); })
              .toThrow(new YllrError('must be true'));
        });

        it('should allow arrays in multiple token rest params', function() {
          expect(function() { yllr.check(false, 'must be {0}: {1}', 'in', [1, 2]); })
              .toThrow(new YllrError('must be in: 1,2'));
        });

        it('should allow arrays in single tokens rest param', function() {
          expect(function() { yllr.check(false, 'must be in: {0}', [[1, 2]]); })
              .toThrow(new YllrError('must be in: 1,2'));
        });
      }); // check()
    }); // functions
  }); // library

  describe('config:', function() {
    var yllr = global[globalNS];

    it('should be defined in "' + globalNS + '"', function() {
      expect(_.isPlainObject(yllr.config)).toEqual(true);
    });

    describe('functions:', function() {
      describe('setErrorType():', function() {
        var OtherError = function(message, tokens) {
          Error.call(this);
        };

        OtherError.prototype = Object.create(Error.prototype);
        OtherError.prototype.constructor = OtherError;

        afterEach(function() {
          // reset any changes a spec may have made
          yllr.config.setErrorType();
        });

        it('should be included', function() {
          expect(_.isFunction(yllr.config.setErrorType)).toEqual(true);
        });

        it('should allow setting alternate assertion error types', function() {
          expect(function() {
            yllr.config.setErrorType(OtherError);
          }).not.toThrow();

          try {
            yllr.check(false);
          } catch(err) {
            expect(err instanceof OtherError).toEqual(true);
          }
        });

        it('should not allow setting invalid alternate error types', function() {
          expect(function() { yllr.config.setErrorType(1); }).toThrow();
          expect(function() { yllr.config.setErrorType(true); }).toThrow();
          expect(function() { yllr.config.setErrorType({}); }).toThrow();
          expect(function() { yllr.config.setErrorType([]); }).toThrow();
          expect(function() { yllr.config.setErrorType(/foo/); }).toThrow();
          expect(function() { yllr.config.setErrorType('foo'); }).toThrow();
        });

        describe('should reset error type given falsy values:', function() {
          var YllrError = yllr.YllrError;

          beforeEach(function() {
            yllr.config.setErrorType(OtherError);
          });

          it('0', function() {
            yllr.config.setErrorType(0);
            try {
              yllr.check(false);
            } catch(err) {
              expect(err instanceof YllrError).toEqual(true);
            }
          });

          it('false', function() {
            yllr.config.setErrorType(false);
            try {
              yllr.check(false);
            } catch(err) {
              expect(err instanceof YllrError).toEqual(true);
            }
          });

          it('undefined', function() {
            yllr.config.setErrorType();
            try {
              yllr.check(false);
            } catch(err) {
              expect(err instanceof YllrError).toEqual(true);
            }
          });

          it('null', function() {
            yllr.config.setErrorType(null);
            try {
              yllr.check(false);
            } catch(err) {
              expect(err instanceof YllrError).toEqual(true);
            }
          });

          it('<empty>', function() {
            yllr.config.setErrorType('');
            try {
              yllr.check(false);
            } catch(err) {
              expect(err instanceof YllrError).toEqual(true);
            }
          });
        }); // reset on falsy values
      }); // setErrorType()

      describe('enableChecks():', function() {
        afterEach(function() {
          // reset what any spec may have done
          yllr.config.enableChecks();
        });

        it('should be included', function() {
          expect(_.isFunction(yllr.config.enableChecks)).toEqual(true);
        });

        it('should prevent check assertions when given falsy values', function() {
          yllr.config.enableChecks(null);
          expect(function() { yllr.check(false); }).not.toThrow();
          yllr.config.enableChecks(false);
          expect(function() { yllr.check(false); }).not.toThrow();
          yllr.config.enableChecks(0);
          expect(function() { yllr.check(false); }).not.toThrow();
          yllr.config.enableChecks('');
          expect(function() { yllr.check(false); }).not.toThrow();
        });

        it('should allow check assertions when given truthy values', function() {
          yllr.config.enableChecks(true);
          expect(function() { yllr.check(false); }).toThrow();
          yllr.config.enableChecks(1);
          expect(function() { yllr.check(false); }).toThrow();
          yllr.config.enableChecks([]);
          expect(function() { yllr.check(false); }).toThrow();
          yllr.config.enableChecks({});
          expect(function() { yllr.check(false); }).toThrow();
          yllr.config.enableChecks('a');
          expect(function() { yllr.check(false); }).toThrow();
          yllr.config.enableChecks(/foo/);
          expect(function() { yllr.check(false); }).toThrow();
          yllr.config.enableChecks(function() {});
          expect(function() { yllr.check(false); }).toThrow();
        });

        it('should allow check assertions by default', function() {
          yllr.config.enableChecks();
          expect(function() { yllr.check(false); }).toThrow();
        });
      }); // enableChecks()

      describe('checksEnabled():', function() {
        afterEach(function() {
          // reset what any spec may have done
          yllr.config.enableChecks();
        });

        it('should be included', function() {
          expect(_.isFunction(yllr.config.checksEnabled)).toEqual(true);
        });

        it('should report whether checks are enabled', function() {
          expect(yllr.config.checksEnabled()).toEqual(true);

          yllr.config.enableChecks(false);
          expect(yllr.config.checksEnabled()).toEqual(false);
        });
      }); // checksEnabled()
    }); // functions
  }); // config
});

})(this);
