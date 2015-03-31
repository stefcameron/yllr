'use strict';

/**
 * A function to configure plugins, presets, and reports in this package.
 * @param {Configuration} conf JSCS configuration object; see interface here:
 *  https://github.com/jscs-dev/node-jscs/blob/master/lib/config/configuration.js
 */
module.exports = function (conf) {
  // register plugins
  conf.registerRule(require('./rules/sc-validate-indentation.js'));
};
