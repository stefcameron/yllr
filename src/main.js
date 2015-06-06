(function(global, factory) {
  'use strict';

  var libName = 'yllr';

  if (typeof define === 'function' && define.amd) {
    define(libName, [], factory); // AMD
  } else if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = factory(); // CommonJS
  } else {
    global[libName] = factory(); // Global
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
    var SuperConstructor = Error;

    /**
     * [[extends: `JavaScript.Error`]]
     * Defines the error that is thrown by default when a check fails.
     *  `error.name` is set to `yllrError`.
     * @class yllr.YllrError
     * @param {String} message The error message.
     * @param {Array.<String>} [tokens] Optional tokens to substitute into the
     *  `message` specified. If tokens are provided, `message` is expected to
     *  contain substitution tokens using the `{n}` syntax where `n` is a zero-based
     *  index matching a token string found in `tokens`.
     */
    var YllrError = function(message, tokens) {
      SuperConstructor.call(this);

      this.message = message;
      this.name = 'yllrError';

      tokens = tokens || []; // normalize
      tokens.forEach(function(token, i) {
        this.message = this.message.replace('{' + i + '}', '' +
            (token === '' ? TYPE_EMPTY : token));
      }.bind(this));
    };

    YllrError.prototype = Object.create(SuperConstructor.prototype);
    YllrError.prototype.constructor = YllrError;

    return YllrError;
  })();

  // Type of error to throw when a check fails. Defaults to `yllr.YllrError`.
  // @type {Function}
  // @see #setErrorType()
  var __errorType = YllrError;

  // `true` if failed checks should result in failures; `false` if checks should
  //  be ignored.
  // @type
  var __checksEnabled = true;

  /**
   * Perform a runtime check.
   * @function yllr.check
   * @param {*} condition Condition to check. If _truthy_, the check passes and
   *  nothing happens. If _falsy_, the check fails, causing a new error to be
   *  thrown with the specified message.
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
   */
  var check = function(condition, message) {
    var params; // Array.<Object>
    var tokens; // Array.<Object> (should be strings)

    if (__checksEnabled && !condition) {
      params = [].slice.call(arguments);
      if (params.length === 3) {
        if (Object.prototype.toString.call(params[2]) === '[object Array]') {
          tokens = params[2]; // token array specified
        } else {
          tokens = [params[2]]; // some other type: consider it a token
        }
      } else if (params.length > 3) {
        // list of tokens
        tokens = params.slice(2);
      }

      throw new __errorType(message || DEFAULT_MESSAGE, tokens);
    }
  };

  /**
   * Customizes the type of error thrown when a `check` fails.
   * @function yllr.config.setErrorType
   * @param {Function} [errorType] If specified, expected to be a constructor
   *  function which has the same signature as the default `YllrError`. If
   *  falsy, resets the error type to `YllrError`.
   * @see {@link yllr.YllrError `yllr.YllrError`}
   */
  var setErrorType = function(errorType) {
    check(!errorType || typeof errorType === 'function',
        'errorType must be falsy or a function');

    __errorType = !!errorType ? errorType : YllrError;
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

    /**
     * Configuration options.
     * @namespace yllr.config
     */
    config: {
      // functions
      setErrorType: setErrorType,
      enableChecks: enableChecks,
      checksEnabled: checksEnabled
    }
  };
});
