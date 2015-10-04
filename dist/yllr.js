/*!
 * yllr 0.0.5
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
  // @type {String}
  var DEFAULT_MESSAGE = 'runtime assertion';

  // Representation of an empty string passed as a token in `check()`.
  // @type {String}
  var TYPE_EMPTY = '<empty>';

  // @type {Function}
  var YllrError = (function() {
    var SuperCtr = Error;

    /**
     * [[extends: `JavaScript.Error`]]
     * Defines the error that is thrown by default when a check fails.
     *  `error.name` is set to `YllrError`.
     * @class yllr.YllrError
     * @param {String} message The error message.
     * @param {Array.<String>} [tokens] Optional tokens to substitute into the
     *  `message` specified. If tokens are provided, `message` is expected to
     *  contain substitution tokens using the `{n}` syntax where `n` is a zero-based
     *  index matching a token string found in `tokens`.
     * @param {String} [context] Optional context string to associate with the error.
     *  A _falsy_ value will be considered `undefined` (no context). If this error
     *  is being instantiated from a _contextual yllr object_, this parameter
     *  will be the associated context.
     * @see {@link yllr.make `yllr.make`}
     */
    var YllrError = function(message, tokens, context) {
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
       * Error context, if specified; `undefined` otherwise.
       * @name yllr.YllrError#context
       * @type {(String|undefined)}
       */
      this.context = context || undefined;

      tokens = tokens || []; // normalize
      tokens.forEach(function(token, i) {
        this.message = this.message.replace('{' + i + '}', '' +
            (token === '' ? TYPE_EMPTY : token));
      }.bind(this));
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
      return this.name + ': ' + (this.context ? (this.context + ': ') : '') +
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

  // Internal check function.
  // @param {String} context Context to associate with the thrown error. Can be
  //  omitted with a falsy value.
  // @see yllr.check
  var __check = function(context, condition, message) {
    var params; // {Array.<Object>}
    var tokens; // {Array.<Object>} (should be strings)
    var result; // {*} truthy/falsy value

    if (__checksEnabled) {
      result = (typeof condition === 'function') ? condition() : condition;
      if (!result) {
        params = [].slice.call(arguments);
        if (params.length === 4) {
          if (Object.prototype.toString.call(params[3]) === '[object Array]') {
            tokens = params[3]; // token array specified
          } else {
            tokens = [params[3]]; // some other type: consider it a token
          }
        } else if (params.length > 4) {
          // list of tokens
          tokens = params.slice(3);
        }

        throw new __ErrorType(message || DEFAULT_MESSAGE, tokens, context);
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
    // invoke internal `__check()` without a context
    __check.apply(this, [undefined].concat(Array.prototype.slice.call(arguments)));
  };

  /**
   * Make a new contextual `yllr` object. The `context` is passed to the
   *  {@link yllr.config.setErrorType error type} constructor when a check fails.
   * @function yllr.make
   * @param {String} context Associated context. Cannot be empty.
   */
  var make = function(context) {
    var proto;

    check(context && typeof context === 'string',
        'context: must be non-empty string');

    /**
     * Contextual yllr object. It has the same interface as the library's main
     *  functions (with the exception of {@link yllr.make `yllr.make`}), with the
     *  addition of an associated context to help with debugging (for instance,
     *  to easily identify the source of the failure).
     * @class yllr.Yllr
     */
    proto = {
      /**
       * Perform a contextual condition check.
       * @method yllr.Yllr#check
       * @param {*} condition Condition to check.
       * @param {String} [message] Optional message.
       * @see {@link yllr.check `yllr.check`}
       */
      check: function(condition, message) {
        // invoke internal `__check()` with the context
        __check.apply(this, [context].concat(Array.prototype.slice.call(arguments)));
      }
    };

    return Object.create(proto);
  };

  /**
   * Customizes the type of error thrown when a `check` fails.
   * @function yllr.config.setErrorType
   * @param {Function} [ErrorType] If specified, expected to be a constructor
   *  function which has the same signature as the default `YllrError`. If
   *  falsy, resets the error type to `YllrError`.
   * @see {@link yllr.YllrError `yllr.YllrError`}
   */
  var setErrorType = function(ErrorType) {
    check(!ErrorType || typeof ErrorType === 'function',
        'ErrorType: must be falsy or function');

    __ErrorType = !!ErrorType ? ErrorType : YllrError;
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
  return {
    // types
    YllrError: YllrError,

    // functions
    check: check,
    make: make,

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
});
