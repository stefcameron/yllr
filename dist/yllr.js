/*!
 * yllr 1.0.0
 * @license MIT, https://github.com/stefcameron/yllr/blob/master/LICENSE
 */
(function(global, factory) {
  'use strict';

  var libName = 'yllr';

  if (typeof define === 'function' && define.amd) {
    define(libName, [], factory); // AMD
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(); // CommonJS
  } else {
    // Global
    (function(prevValue) {
      var lib = factory();

      global[libName] = lib;

      /**
       * Restores the previous value of `global.yllr` (i.e. `window.yllr`) and
       *  returns a reference to the `yllr` library.
       *
       * This configuration function only exists if the library was registered
       *  into the global namespace. It will not exist if it was registered as
       *  an AMD or CommonJS module.
       *
       * Once this function is called, it will be removed (i.e. it can only be
       *  called once).
       *
       * @function yllr.config.noConflict
       * @returns {yllr} Reference to the `yllr` library.
       */
      lib.config.noConflict = function() {
        global[libName] = prevValue; // restore previous value (even if `undefined`)
        lib.config.noConflict = undefined; // remove this function
        return lib; // return the library
      };
    })(global[libName]);
  }
})(this, function() {
  'use strict';

  // Default message to display if one isn't provided for a `check()`.
  // @const {String}
  var DEFAULT_MESSAGE = 'runtime assertion';

  // Representation of an empty string passed as a token in `check()`.
  // @const {String}
  var TYPE_EMPTY = '<empty>';

  // Global `yllr` library definition.
  // @type {Object}
  // @see yllr
  var $yllr;

  // @type {Function}
  var YllrError = (function() {
    var SuperCtr = Error;

    /**
     * [[extends: `JavaScript.Error`]]
     * Defines the error that is thrown by default when a check fails.
     *  `error.name` is set to `YllrError`.
     * @class yllr.YllrError
     * @param {String} message The error message.
     * @param {(Object|undefined)} [context] Optional context object to associate
     *  with the error. An `undefined` value equates to no context. If this error
     *  is being instantiated from a _contextual yllr object_, this parameter should
     *  be the associated context.
     * @see {@link yllr.make `yllr.make`}
     */
    var YllrError = function(message, context) {
      SuperCtr.call(this);

      /**
       * Error message.
       * @name yllr.YllrError#message
       * @type {String}
       */
      this.message = message;

      /**
       * Error name/code.
       * @name yllr.YllrError#name
       * @type {String}
       */
      this.name = 'YllrError';

      /**
       * Error context, if specified; `undefined` if there is no context.
       * @name yllr.YllrError#context
       * @type {(Object|undefined)}
       */
      this.context = context;
    };

    YllrError.prototype = Object.create(SuperCtr.prototype);
    YllrError.prototype.constructor = YllrError;

    /**
     * [[overrides: `JavaScript.Error.toString()`]]
     * Generates a string representation of this error.
     * @method yllr.YllrError#toString
     * @returns {String} A string representation of this error.
     */
    YllrError.prototype.toString = function() {
      // use a format similar to Error.toString()
      return this.name + ': ' +
          (this.context !== undefined ? (this.context + ': ') : '') +
          this.message;
    };

    return YllrError;
  })();

  // Type of error to throw when a check fails. Defaults to `yllr.YllrError`.
  // @type {Function}
  // @see #setErrorType()
  var __ErrorType = YllrError;

  // `true` if failed checks should result in failures; `false` if checks should
  //  be ignored.
  // @type
  var __checksEnabled = true;

  /**
   * Replace any tokens in a given message.
   * @function yllr.tokenize
   * @param {String} message Message containing `{n}`-style tokens. If _falsy_,
   *  it's considered to be an empty strig.
   * @param {Array} tokens Token values. Any tokens which aren't strings are
   *  cast to strings.
   * @param {(Object|undefined)} [context] Optional context associated with the
   *  `message`. An `undefined` value equates to no context. __Note:__ the current
   *  implementation ignores this parameter.
   * @returns {String} Message with tokens substituted; empty string if `message`
   *  was _falsy_.
   */
  var tokenize = function(message, tokens, context) {
    message = message || ''; // normalize
    tokens = tokens || []; // normalize

    // NOTE: `context` is ignored since we're replacing any tokens; it's passed
    //  in just in case someone decides they want to override this method and
    //  for some reason want the `context`

    tokens.forEach(function(token, i) {
      message = message.replace(new RegExp('\\{' + i + '\\}', 'g'),
          '' + (token === '' ? TYPE_EMPTY : token));
    });

    return message;
  };

  // Internal failure handler. Called within the context of the related `yllr`:
  //  Either the `yllr` library, or a contextual `yllr` object.
  // @param {String} message See `yllr.onFail@message`.
  // @param {Array} tokens See `yllr.onFail@tokens`.
  // @see yllr.onFail
  var __onFail = function(message, tokens) {
    var context = this === $yllr ? undefined : this.context;

    // call global/public `tokenize()` in its normal execution context since it's
    //  not meant to be a 'method' of the `yllr` library nor a contextual `yllr`
    //  object
    message = $yllr.tokenize(message || DEFAULT_MESSAGE, tokens, context);

    throw new __ErrorType(message, context);
  };

  /**
   * Handle a failed check. The default behavior is to throw a new instance
   *  of the {@link yllr.config.setErrorType configured error type}.
   *
   * Override this method to customize the behavior of a failed check:
   *
   * ```javascript
   * //// Global checks:
   * yllr.onFail = function(message, tokens) {
   *   // custom code...
   * };
   * ```
   *
   * ```javascript
   * //// Contextual checks (per-instance):
   * var y = yllr.make('myFunction');
   * y.onFail = function(message, tokens) {
   *   // custom code...
   * };
   * ```
   *
   * ```javascript
   * //// Contextual checks (all instances):
   * (function(yllrMake) {
   *   var ctxOnFail = function(message, tokens) {
   *     // custom code...
   *   };
   *   yllr.make = function(context) {
   *     var y = yllrMake.call(this, context);
   *     y.onFail = ctxOnFail;
   *     return y;
   *   };
   * })(yllr.make);
   * ```
   *
   * @function yllr.onFail
   * @param {(String|undefined)} message Failed check message (may contain tokens).
   *  If _falsy_ (because a message wasn't provided for the failed check), a default
   *  message is used. The {@link yllr.tokenize} function is used to substitute any
   *  tokens into the `message`.
   * @param {Array} tokens Token values to substitute into `message`. Empty
   *  array if none were given for the failed check.
   * @see {@link yllr.check `yllr.check()`}
   * @see {@link yllr.Yllr#check `yllr.Yllr#check()`}
   * @see {@link yllr.Yllr#onFail `yllr.Yllr#onFail()`}
   */
  var onFail = function(message, tokens) {
    __onFail.call(this, message, tokens);
  };

  // Internal check function. Called within the execution context of the related
  //  `yllr`: Either the global `yllr`, or a contextual `yllr` object.
  // @param {*} condition See `yllr.check@condition`.
  // @param {String} [message] See `yllr.check@message`.
  // @param {Array.<String>|...} [tokens] Optional substitution tokens for the
  //  `message`. Either an array of strings, or multiple string parameters.
  //  If a 4th parameter is specified and is an array, only that parameter is
  //  is used (considered to be __all__ tokens). Otherwise, all remaining parameters
  //  are used as the combined list of tokens.
  // @see yllr.check
  var __check = function(condition, message) {
    var params; // {Array.<Object>}
    var tokens; // {Array.<Object>} (should be strings)
    var result; // {*} truthy/falsy value

    if (__checksEnabled) {
      result = (typeof condition === 'function') ? condition() : condition;

      if (!result) {
        params = [].slice.call(arguments);

        if (params.length === 3) {
          if (Object.prototype.toString.call(params[2]) === '[object Array]') {
            // token array specified
            tokens = params[2];
          } else {
            // some other type: consider it a single token and wrap in array
            tokens = [params[2]];
          }
        } else if (params.length > 3) {
          // list of tokens: get an array with all of them
          tokens = params.slice(2);
        } else {
          // no tokens
          tokens = [];
        }

        // call the failure hanler within the current execution context
        this.onFail(message, tokens);
      }
    }
  };

  /**
   * Check a condition.
   * @function yllr.check
   * @param {*} condition Condition to check. If _truthy_, the check passes and
   *  nothing happens. If _falsy_, the check fails, causing a new error to be
   *  thrown with the specified message.
   *
   *  If the `condition` is a function, it's expected to be one which returns
   *  a _truthy_ or _falsy_ value. Using a function ensures that the condition
   *  evaluation code is truly only executed IIF checks are enabled.
   *
   * @param {String} [message] Optional message. A generic message is used if
   *  one is not provided.
   * @param {...String} [tokens] Optional substitution tokens for the
   *  `message`, passed to the generated error. This can be specified either as
   *  a _single_ `Array.<String>` parameter (in which case each element is considered
   *  to be a token), or as multiple parameters (in which case arrays are treated
   *  as tokens, not their elements).
   *
   *  When using the single array parameter, an array can be passed as a single
   *   token by wrapping it in the token array: `[[1, 2, 3], 'a']` would result
   *   in two tokens, the first being an `Array.<Number>` and the second being
   *   a `String`. This is the exception if you need to pass one token and it
   *   happens to be an array.
   *
   * @see {@link yllr.make `yllr.make`}
   * @see {@link yllr.config.enableChecks `yllr.config.enableChecks`}
   */
  var check = function(condition, message) {
    // invoke internal `__check()` within the current execution context
    __check.apply(this, [].slice.call(arguments));
  };

  /**
   * Make a new contextual `yllr` object. The `context` is passed to the
   *  {@link yllr.config.setErrorType error type} constructor when a check fails.
   * @function yllr.make
   * @param {Object} context Associated context. Can be any value except `undefined`;
   *  normally a `String`. If `undefined`, will be interpreted as `null`.
   */
  var make = function(context) {
    var proto;

    context = context === undefined ? null : context;

    /**
     * Contextual yllr object. It has the same interface as the library's main
     *  functions (with the exception of {@link yllr.make `yllr.make`}), with the
     *  addition of an associated context to help with debugging (for instance,
     *  to make it easier to identify the source of the failure).
     * @class yllr.Yllr
     */
    proto = {
      /**
       * The context associated with this `yllr` object. Note that `null` is
       *  technically an object and therefore a valid context. This property
       *  should not be `undefined` given how {@link yllr.make `yllr.make()`} works.
       * @name yllr.Yllr#context
       * @type {Object}
       */
      context: context,

      /**
       * Perform a contextual condition check.
       * @method yllr.Yllr#check
       * @param {*} condition Condition to check.
       * @param {String} [message] Optional message.
       * @param {...String} [tokens] Optional substitution tokens.
       * @see {@link yllr.check `yllr.check`}
       */
      check: function(condition, message) {
        // invoke internal `__check()` within the current execution context using
        //  any/all given parameters
        __check.apply(this, [].slice.call(arguments));
      },

      /**
       * Handle a contextual check failure.
       *
       * Override this method to customize the behavior of a failed contextual
       *  check.
       *
       * @method yllr.Yllr#onFail
       * @param {(String|undefined)} message Associated message, if any.
       * @param {Array} tokens Tokens, if any; empty if none.
       * @see {@link yllr.onFail `yllr.onFail`}
       */
      onFail: function(message, tokens) {
        // invoke internal `__onFail()` within the current execution context using
        //  any/all given parameters
        __onFail.apply(this, [].slice.call(arguments));
      }
    };

    return Object.create(proto);
  };

  /**
   * Customizes the type of error thrown when a `check` fails.
   * @function yllr.config.setErrorType
   * @param {Function} [ErrorType] If specified, expected to be a constructor
   *  function which has the same signature as the default `YllrError`. If
   *  not a function, resets the error type to `YllrError`.
   * @see {@link yllr.YllrError `yllr.YllrError`}
   */
  var setErrorType = function(ErrorType) {
    __ErrorType = (typeof ErrorType === 'function') ? ErrorType : YllrError;
  };

  /**
   * Allows enabling or disabling all checks. Subsequent calls to `yllr.check`
   *  will cause failures if enabled, or do nothing if disabled.
   * @function yllr.config.enableChecks
   * @param {Boolean} [enable=true] If _truthy_ (or unspecified), checks are
   *  enabled; otherwise, checks are disabled.
   * @see {@link yllr.config.checksEnabled `yllr.config.checksEnabled()`}
   */
  var enableChecks = function(enable) {
    __checksEnabled = enable === undefined || !!enable;
  };

  /**
   * Determines if all checks are enabled; a compliment to `config.enableChecks()`.
   * @function yllr.config.checksEnabled
   * @returns {Boolean} `true` if all checks are enabled; `false` otherwise.
   * @see {@link yllr.config.enableChecks `yllr.config.enableChecks()`}
   */
  var checksEnabled = function() {
    return __checksEnabled;
  };

  /**
   * The `yllr` library.
   * @namespace yllr
   */
  $yllr = {
    // types
    YllrError: YllrError,

    // functions
    tokenize: tokenize,
    check: check,
    make: make,

    // handlers
    onFail: onFail,

    /**
     * Configuration options.
     * @namespace yllr.config
     */
    config: {
      // functions
      setErrorType: setErrorType,
      enableChecks: enableChecks,
      checksEnabled: checksEnabled,

      // NOTE: noConflict is set by the UMD only when registering as a global
      noConflict: undefined
    }
  };

  return $yllr;
});
