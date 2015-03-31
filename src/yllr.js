(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory); // AMD
  } else if (typeof exports === 'object') {
    module.exports = factory(); // CommonJS
  } else {
    global.yllr = factory(); // Global
  }
})(this, function() {
  'use strict';

  var YllrError = (function() {
    var Super = Error;

    /**
     * Defines the error that is throw by default when a check fails.
     * @class yllr.YllrError
     * @param {String} message The error message.
     * @param {Array.<String>} [tokens] Optional tokens to substitute into the
     *  `message` specified. If tokens are provided, `message` is expected to
     *  contain substitution tokens using the `{n}` syntax where `n` is a zero-based
     *  index matching a token string found in `tokens`.
     */
    var YllrError = function(message, tokens) {
      tokens = tokens || []; // normalize

      Super.call(this, message);

      this.name = 'YllrError';

      tokens.forEach(function(token, i) {
        this.message = this.message.replace('{' + i + '}', '' + token);
      }.bind(this));
    };

    YllrError.prototype = Object.create(Super.prototype);
    YllrError.prototype.constructor = YllrError;

    return YllrError;
  })();

  // Type of error to throw when a check fails.
  // @see #setErrorType()
  var __errorType = YllrError;

  /**
   * Perform a runtime check.
   * @function yllr.check
   * @param {*} condition Condition to check. If _truthy_, the check passes and
   *  nothing happens. If _falsy_, the check fails, causing a new error to be
   *  thrown with the specified message.
   * @param {String} [message] Optional message. A generic message is used if
   *  one is not provided.
   * @param {Array.<String>} [tokens] Optional substitution tokens for the
   *  `message`, passed to the generated error.
   */
  var check = function(condition, message, tokens) {
    if (!condition) {
      throw new __errorType(message, tokens);
    }
  };

  /**
   * Customizes the type of error thrown when a `check` fails.
   * @function yllr.config.setErrorType
   * @param {Function} [errorType] If specified, expected to be a constructor
   *  function which has the same signature as the default `YllrError`. If
   *  falsy, resets the error type to `YllrError`.
   * @see yllr.YllrError
   */
  var setErrorType = function(errorType) {
    check(!errorType || typeof errorType === 'function',
        'errorType must be falsy or a function');

    __errorType = !!errorType ? errorType : YllrError;
  };

  /**
   * The `yllr` namespace.
   * @namespace yllr
   */
  return {
    // types
    YllrError: YllrError,

    // methods
    check: check

    /**
     * The `yllr.config` namespace.
     * @namespace yllr.config
     */
    config: {
      setErrorType: setErrorType
    }
  };
})();
