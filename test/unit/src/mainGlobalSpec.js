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

        it('should have the name "YllrError"', function() {
          var err = new YllrError();
          expect(err.name).toEqual('YllrError');
        });

        it('should default to undefined context', function() {
          var err;

          err = new YllrError();
          expect(err.context).toEqual(undefined);
        });

        it('should use any context', function() {
          var f = function() {};
          var re = /foo/;
          var ctx;
          var err;

          err = new YllrError('foo', 'a');
          expect(err.context).toEqual('a');

          err = new YllrError('foo', []);
          expect(err.context).toEqual([]);

          err = new YllrError('foo', {});
          expect(err.context).toEqual({});

          ctx = {bar: 5};
          err = new YllrError('foo', ctx);
          expect(err.context === ctx).toEqual(true); // same reference

          ctx = [1, 2, 3];
          err = new YllrError('foo', ctx);
          expect(err.context === ctx).toEqual(true); // same reference

          ctx = function() {};
          err = new YllrError('foo', ctx);
          expect(err.context === ctx).toEqual(true); // same reference

          err = new YllrError('foo', true);
          expect(err.context).toEqual(true);

          err = new YllrError('foo', 1);
          expect(err.context).toEqual(1);

          err = new YllrError('foo', re);
          expect(err.context).toEqual(re);

          err = new YllrError('foo', f);
          expect(err.context).toEqual(f);

          err = new YllrError('foo', null);
          expect(err.context).toEqual(null);

          err = new YllrError('foo', false);
          expect(err.context).toEqual(false);

          err = new YllrError('foo', 0);
          expect(err.context).toEqual(0);

          err = new YllrError('foo', '');
          expect(err.context).toEqual('');
        });

        it('should take a message', function() {
          var err = new YllrError('foo');
          expect(err.message).toEqual('foo');
        });

        it('should have specialized toString representation', function() {
          var err;

          err = new YllrError('foo'); // no context
          expect('' + err).toEqual('YllrError: foo');

          err = new YllrError('foo', 'context');
          expect('' + err).toEqual('YllrError: context: foo');
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
          expect(function() { yllr.check('a'); }).not.toThrow();
          expect(function() { yllr.check(1); }).not.toThrow();
          expect(function() { yllr.check({}); }).not.toThrow();
          expect(function() { yllr.check([]); }).not.toThrow();
          expect(function() { yllr.check(/foo/); }).not.toThrow();
        });

        it('should throw if condition is not met', function() {
          expect(function() { yllr.check(false); }).toThrow();
          expect(function() { yllr.check(''); }).toThrow();
          expect(function() { yllr.check(0); }).toThrow();
          expect(function() { yllr.check(undefined); }).toThrow();
          expect(function() { yllr.check(null); }).toThrow();
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

        it('should replace multiple instances of the same token', function() {
          expect(function() { yllr.check(false, '{0} {0} {0}', 'must', 'be', true); })
              .toThrow(new YllrError('must must must'));
        });

        it('should call condition function', function() {
          var result;
          var condition = function() {
            return result;
          };

          result = true;
          expect(function() { yllr.check(condition()); }).not.toThrow();

          result = false;
          expect(function() { yllr.check(condition()); }).toThrow();
        });
      }); // check()

      describe('make():', function() {
        it('should be included', function() {
          expect(_.isFunction(yllr.make)).toEqual(true);
        });

        it('should use any value as context except undefined', function() {
          expect(function() { yllr.make(); }).not.toThrow();
          expect(function() { yllr.make(undefined); }).not.toThrow();
          expect(function() { yllr.make(null); }).not.toThrow();
          expect(function() { yllr.make(''); }).not.toThrow();
          expect(function() { yllr.make(0); }).not.toThrow();
          expect(function() { yllr.make(1); }).not.toThrow();
          expect(function() { yllr.make(true); }).not.toThrow();
          expect(function() { yllr.make(false); }).not.toThrow();
          expect(function() { yllr.make({}); }).not.toThrow();
          expect(function() { yllr.make([]); }).not.toThrow();
          expect(function() { yllr.make(/foo/); }).not.toThrow();
          expect(function() { yllr.make(function() {}); }).not.toThrow();
          expect(function() { yllr.make('a'); }).not.toThrow();
        });

        it('should interpret undefined context as null', function() {
          expect(yllr.make(undefined).context).toEqual(null);
        });

        describe('context yllr object:', function() {
          it('should have expected methods', function() {
            var y = yllr.make('foo');

            expect(Object.keys(y)).toEqual([]); // no instance properties

            // proeprties/methods defined on the __proto__
            expect(Object.keys(Object.getPrototypeOf(y))).toEqual([
              'context',
              'check',
              'onFail'
            ]);

            expect(y.context).toBeDefined();
            expect(_.isFunction(y.check)).toEqual(true);
            expect(_.isFunction(y.onFail)).toEqual(true);
          });

          it('should provide its context', function() {
            var ctx = {foo: 3};
            var y = yllr.make(ctx);

            expect(y.context === ctx).toEqual(true); // same reference
          });

          it('should be contextual', function() {
            var y = yllr.make('foo');

            try {
              y.check(false, 'bar');
            } catch (err) {
              expect(err instanceof yllr.YllrError).toEqual(true);
              expect(err.name).toEqual('YllrError');
              expect(err.message).toEqual('bar');
              expect(err.context).toEqual('foo');
            }
          });

          describe('onFail():', function() {
            it('should be called when a check fails', function() {
              var y = yllr.make('ctx');

              spyOn(y, 'onFail');
              spyOn(yllr, 'onFail');

              y.check(false, 'foo');
              expect(yllr.onFail).not.toHaveBeenCalled();
              expect(y.onFail).toHaveBeenCalledWith('foo', []);
              expect(y.onFail.calls.mostRecent().object === y).toEqual(true);

              y.check(false, 'foo', 'bar');
              expect(yllr.onFail).not.toHaveBeenCalled();
              expect(y.onFail).toHaveBeenCalledWith('foo', ['bar']);
              expect(y.onFail.calls.mostRecent().object === y).toEqual(true);

              y.check(false, 'foo', ['bar', 2]);
              expect(yllr.onFail).not.toHaveBeenCalled();
              expect(y.onFail).toHaveBeenCalledWith('foo', ['bar', 2]);
              expect(y.onFail.calls.mostRecent().object === y).toEqual(true);

              y.check(false, 'foo', 'bar', 2);
              expect(yllr.onFail).not.toHaveBeenCalled();
              expect(y.onFail).toHaveBeenCalledWith('foo', ['bar', 2]);
              expect(y.onFail.calls.mostRecent().object === y).toEqual(true);

              y.check(false, 'foo', [['bar', 2]]);
              expect(yllr.onFail).not.toHaveBeenCalled();
              expect(y.onFail).toHaveBeenCalledWith('foo', [['bar', 2]]);
              expect(y.onFail.calls.mostRecent().object === y).toEqual(true);

              y.check(false, 'foo', ['bar', 2], 3);
              expect(yllr.onFail).not.toHaveBeenCalled();
              expect(y.onFail).toHaveBeenCalledWith('foo', [['bar', 2], 3]);
              expect(y.onFail.calls.mostRecent().object === y).toEqual(true);
            });
          }); // onFail()
        });

        describe('context yllr message tokens:', function() {
          var YllrError = yllr.YllrError;
          var ctxYllr = yllr.make('foo');

          it('should allow tokens in check message', function() {
            expect(function() { ctxYllr.check(false, 'must be {0}', ['true']); })
                .toThrow(new YllrError('must be true'));
          });

          it('should allow non-array token in check message', function() {
            expect(function() { ctxYllr.check(false, 'must be {0}', true); })
                .toThrow(new YllrError('must be true'));
          });

          it('should use rest params as tokens in check message', function() {
            expect(function() { ctxYllr.check(false, '{0} {1} {2}', 'must', 'be', true); })
                .toThrow(new YllrError('must be true'));
          });

          it('should allow arrays in multiple token rest params', function() {
            expect(function() { ctxYllr.check(false, 'must be {0}: {1}', 'in', [1, 2]); })
                .toThrow(new YllrError('must be in: 1,2'));
          });

          it('should allow arrays in single tokens rest param', function() {
            expect(function() { ctxYllr.check(false, 'must be in: {0}', [[1, 2]]); })
                .toThrow(new YllrError('must be in: 1,2'));
          });

          it('should replace multiple instances of the same token', function() {
            expect(function() { ctxYllr.check(false, '{0} {0} {0}', 'must', 'be', true); })
                .toThrow(new YllrError('must must must'));
          });
        }); // context yllr message tokens
      }); // make()

      describe('onFail():', function() {
        it('should be included', function() {
          expect(_.isFunction(yllr.onFail)).toEqual(true);
        });

        it('should be called when a check fails', function() {
          spyOn(yllr, 'onFail');

          yllr.check(false, 'foo');
          expect(yllr.onFail).toHaveBeenCalledWith('foo', []);
          expect(yllr.onFail.calls.mostRecent().object === yllr).toEqual(true);

          yllr.check(false, 'foo', 'bar');
          expect(yllr.onFail).toHaveBeenCalledWith('foo', ['bar']);
          expect(yllr.onFail.calls.mostRecent().object === yllr).toEqual(true);

          yllr.check(false, 'foo', ['bar', 2]);
          expect(yllr.onFail).toHaveBeenCalledWith('foo', ['bar', 2]);
          expect(yllr.onFail.calls.mostRecent().object === yllr).toEqual(true);

          yllr.check(false, 'foo', 'bar', 2);
          expect(yllr.onFail).toHaveBeenCalledWith('foo', ['bar', 2]);
          expect(yllr.onFail.calls.mostRecent().object === yllr).toEqual(true);

          yllr.check(false, 'foo', [['bar', 2]]);
          expect(yllr.onFail).toHaveBeenCalledWith('foo', [['bar', 2]]);
          expect(yllr.onFail.calls.mostRecent().object === yllr).toEqual(true);

          yllr.check(false, 'foo', ['bar', 2], 3);
          expect(yllr.onFail).toHaveBeenCalledWith('foo', [['bar', 2], 3]);
          expect(yllr.onFail.calls.mostRecent().object === yllr).toEqual(true);
        });
      }); // onFail()

      describe('tokenize():', function() {
        it('should be included', function() {
          expect(_.isFunction(yllr.tokenize)).toEqual(true);
        });

        it('should be called when a check fails with default onFail() ' +
              'and context arg should be undefined', function() {

          spyOn(yllr, 'tokenize').and.callThrough();

          expect(function() { yllr.check(false, 'foo'); }).toThrow();
          expect(yllr.tokenize).toHaveBeenCalledWith('foo', [], undefined);
          expect(yllr.tokenize.calls.mostRecent().object === yllr).toEqual(true);

          expect(function() { yllr.check(false, 'foo', 'bar'); }).toThrow();
          expect(yllr.tokenize).toHaveBeenCalledWith('foo', ['bar'], undefined);
          expect(yllr.tokenize.calls.mostRecent().object === yllr).toEqual(true);

          expect(function() { yllr.check(false, 'foo', ['bar', 2]); }).toThrow();
          expect(yllr.tokenize).toHaveBeenCalledWith('foo', ['bar', 2], undefined);
          expect(yllr.tokenize.calls.mostRecent().object === yllr).toEqual(true);

          expect(function() { yllr.check(false, 'foo', 'bar', 2); }).toThrow();
          expect(yllr.tokenize).toHaveBeenCalledWith('foo', ['bar', 2], undefined);
          expect(yllr.tokenize.calls.mostRecent().object === yllr).toEqual(true);

          expect(function() { yllr.check(false, 'foo', [['bar', 2]]); }).toThrow();
          expect(yllr.tokenize).toHaveBeenCalledWith('foo', [['bar', 2]], undefined);
          expect(yllr.tokenize.calls.mostRecent().object === yllr).toEqual(true);

          expect(function() { yllr.check(false, 'foo', ['bar', 2], 3); }).toThrow();
          expect(yllr.tokenize).toHaveBeenCalledWith('foo', [['bar', 2], 3], undefined);
          expect(yllr.tokenize.calls.mostRecent().object === yllr).toEqual(true);
        });

        it('should be called when a contextual check fails with default onFail() ' +
              'and context arg should be as specified', function() {

          var ctx = ['ctx'];
          var y = yllr.make(ctx);

          spyOn(yllr, 'tokenize').and.callThrough();

          // NOTE: execution context should always be the global, not the contextual

          expect(function() { y.check(false, 'foo'); }).toThrow();
          expect(yllr.tokenize).toHaveBeenCalledWith('foo', [], ctx);
          expect(yllr.tokenize.calls.mostRecent().object === yllr).toEqual(true);

          expect(function() { y.check(false, 'foo', 'bar'); }).toThrow();
          expect(yllr.tokenize).toHaveBeenCalledWith('foo', ['bar'], ctx);
          expect(yllr.tokenize.calls.mostRecent().object === yllr).toEqual(true);

          expect(function() { y.check(false, 'foo', ['bar', 2]); }).toThrow();
          expect(yllr.tokenize).toHaveBeenCalledWith('foo', ['bar', 2], ctx);
          expect(yllr.tokenize.calls.mostRecent().object === yllr).toEqual(true);

          expect(function() { y.check(false, 'foo', 'bar', 2); }).toThrow();
          expect(yllr.tokenize).toHaveBeenCalledWith('foo', ['bar', 2], ctx);
          expect(yllr.tokenize.calls.mostRecent().object === yllr).toEqual(true);

          expect(function() { y.check(false, 'foo', [['bar', 2]]); }).toThrow();
          expect(yllr.tokenize).toHaveBeenCalledWith('foo', [['bar', 2]], ctx);
          expect(yllr.tokenize.calls.mostRecent().object === yllr).toEqual(true);

          expect(function() { y.check(false, 'foo', ['bar', 2], 3); }).toThrow();
          expect(yllr.tokenize).toHaveBeenCalledWith('foo', [['bar', 2], 3], ctx);
          expect(yllr.tokenize.calls.mostRecent().object === yllr).toEqual(true);
        });

        it('should replace tokens in the message', function() {
          var template = 'hello {0} {1}';

          // no replacement
          expect(yllr.tokenize(template)).toEqual(template);
          // no tokens to use
          expect(yllr.tokenize(template, [])).toEqual(template);
          // only {0} replaced
          expect(yllr.tokenize(template, ['a'])).toEqual('hello a {1}');
          // all replaced
          expect(yllr.tokenize(template, ['a', 'b'])).toEqual('hello a b');
          // extra tokens ignored
          expect(yllr.tokenize(template, ['a', 'b', 'c'])).toEqual('hello a b');
          // non-string tokens are converted to strings
          expect(yllr.tokenize(template, [1, {}])).toEqual('hello 1 ' + {}.toString());
        });

        it('should replace multiple instances of the same token', function() {
          expect(yllr.tokenize('{0} {0} {0}', ['foo'])).toEqual('foo foo foo');
        });

        it('should replace empty string tokens with special string', function() {
          expect(yllr.tokenize('{0}', [''])).toEqual('<empty>');
        });
      }); // tokenize()
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

          expect(function() { yllr.check(false); }).toThrowError(OtherError);
        });

        describe('should reset error type given invalid values:', function() {
          var YllrError = yllr.YllrError;

          beforeEach(function() {
            yllr.config.setErrorType(OtherError);
          });

          it('0', function() {
            yllr.config.setErrorType(0);
            expect(function() { yllr.check(false); }).toThrowError(YllrError);
          });

          it('false', function() {
            yllr.config.setErrorType(false);
            expect(function() { yllr.check(false); }).toThrowError(YllrError);
          });

          it('undefined', function() {
            yllr.config.setErrorType();
            expect(function() { yllr.check(false); }).toThrowError(YllrError);
          });

          it('null', function() {
            yllr.config.setErrorType(null);
            expect(function() { yllr.check(false); }).toThrowError(YllrError);
          });

          it('<empty>', function() {
            yllr.config.setErrorType('');
            expect(function() { yllr.check(false); }).toThrowError(YllrError);
          });

          it('1', function() {
            yllr.config.setErrorType(1);
            expect(function() { yllr.check(false); }).toThrowError(yllr.YllrError);
          });

          it('true', function() {
            yllr.config.setErrorType(true);
            expect(function() { yllr.check(false); }).toThrowError(yllr.YllrError);
          });

          it('{}', function() {
            yllr.config.setErrorType({});
            expect(function() { yllr.check(false); }).toThrowError(yllr.YllrError);
          });

          it('[]', function() {
            yllr.config.setErrorType([]);
            expect(function() { yllr.check(false); }).toThrowError(yllr.YllrError);
          });

          it('/foo/', function() {
            yllr.config.setErrorType(/foo/);
            expect(function() { yllr.check(false); }).toThrowError(yllr.YllrError);
          });

          it('foo', function() {
            yllr.config.setErrorType('foo');
            expect(function() { yllr.check(false); }).toThrowError(yllr.YllrError);
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

        it('should not call condition function when checks disabled', function() {
          var called = false;
          var condition = function() {
            called = true;
            return true; // pass check
          };

          yllr.config.enableChecks(false);
          yllr.check(condition);
          expect(called).toEqual(false);

          yllr.config.enableChecks(true);
          yllr.check(condition);
          expect(called).toEqual(true);
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

      describe('noConflict():', function() {
        var oldYllr;
        var oldNoConflict;

        beforeEach(function() {
          oldYllr = global[globalNS];
          oldNoConflict = oldYllr.config.noConflict;
        });

        afterEach(function() {
          // undo what noConflict() did for following tests
          global[globalNS] = oldYllr;
          oldYllr.config.noConflict = oldNoConflict;
        });

        it('should return yllr and undefine itself', function() {
          var y;

          expect(_.isFunction(yllr.config.noConflict)).toEqual(true);

          y = yllr.config.noConflict();

          expect(y === oldYllr).toEqual(true); // returned itself
          expect(global[globalNS]).toEqual(undefined); // reset to original env value
          expect(y.config.noConflict).toEqual(undefined); // undefined itself
        });
      });
    }); // functions
  }); // config
});

})(this);
