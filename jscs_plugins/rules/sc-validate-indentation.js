'use strict';

// Default indentation size.
// @type {Number}
var DEFAULT_SIZE = 2;

// Default JSDoc allowance.
// @type {Boolean}
var DEFAULT_ALLOW_JSDOC = true;

// Default indentation character.
// @type {String}
var DEFAULT_WHITESPACE = ' ';

// Assertion test.
// @param {*} condition If _falsy_, an error is thrown.
// @param {String} message Error message, if `condition` is not met.
var assert = function(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
};

/**
 * JSCS rule to validate code indentation style.
 * @class
 */
var Rule = function() {
  // NOTE: Due to the way JSCS calls plugin rules, we don't have access to
  //  `this` here. The best place to set properties `this` is in #configure()
  //  which gets called prior to #check().
};

// @returns {String} Option name for configuration.
Rule.prototype.getOptionName = function () {
  return 'scValidateIndentation';
};

/**
 * Configure this rule for one JSCS pass.
 * @param {(Boolean|Object)} options Object with the following properties:
 *
 *  - `size:Number [2]`: Indent width. Minimum setting is 1.
 *  - `allowJsdoc:Boolean [true]`: If `true`, allows for JSDoc block comment
 *   syntax which causes a multiline comment's intermediate lines (between the
 *   first, which opens with _slash-star-star_, and the last, which ends with
 *   _star-slash_) to be off by a single extra space from the expected indentation
 *   depth.
 *
 *  Can also be `true` (only) to use all the defaults.
 */
Rule.prototype.configure = function(options) {
  assert(typeof options === 'object' || options === true, this.getOptionName() +
      ' option requires an object or a `true` value when in use');

  /**
   * [Internal] Stored rule options.
   * @type {Object}
   * @see #configure()
   */
  this._options = (typeof options === 'object') ? options : {
    size: DEFAULT_SIZE,
    allowJsdoc: DEFAULT_ALLOW_JSDOC
  };

  if (this._options.size !== undefined) {
    assert((typeof this._options.size === 'number') && this._options.size >= 1,
        this.getOptionName() + '.options.size must be >= 1');
  } else {
    this._options.size = DEFAULT_SIZE; // use default
  }

  if (this._options.allowJsdoc !== undefined) {
    assert((typeof this._options.allowJsdoc === 'boolean'), this.getOptionName() +
        '.options.allowJsdoc must be a boolean');
  } else {
    this._options.allowJsdoc = DEFAULT_ALLOW_JSDOC; // use default
  }
};

/**
 * Validate a file against this rule, report errors.
 * @param {Object} file JSCS File object; see interface here:
 *  https://github.com/jscs-dev/node-jscs/blob/master/lib/js-file.js
 * @param {Object} errors JSCS Errors object; see interface here:
 *  https://github.com/jscs-dev/node-jscs/blob/master/lib/errors.js
 */
Rule.prototype.check = function(file, errors) {
  var lines = file.getLines(); // @type {Array.<String>}
  var indentRE = new RegExp('^(' + DEFAULT_WHITESPACE + '*)');

  lines.forEach(function(line, i) {
    var match = indentRE.exec(line);
    var indent = (match && match[1]) ? match[1] : '';
    var mod = indent.length % this._options.size;

    if (mod !== 0) {
      // ignore line if it's just 1 off and it starts with an asterisk,
      //  indicating it's a JSDoc-style comment where a column of '*' is
      //  aligned under the first asterisk in the opening '/**' pattern,
      //  causing the indentation of the multiline comment to be off by 1
      if (!this._options.allowJsdoc ||
          (mod === 1 && line.length > indent.length &&
              line[indent.length] !== '*')) {

        errors.add('[SC] Line indentation is incorrect (' + indent.length +
            '): expecting multiple of ' + this._options.size, i, indent.length);
      }
    }
  }.bind(this));
};

module.exports = Rule;
