# yllr

[![Build Status](https://travis-ci.org/stefcameron/yllr.svg?branch=master)](https://travis-ci.org/stefcameron/yllr) [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

Minimal runtime assertion library.

## Goal

This library aims to be __small__. The current release is just 904 bytes in its minified form. It has just enough functionality (i.e. _syntactic sugar_) to make it easy to add and manage runtime assertions in your code base.

The goal is not to replace static code analysis provided by transpilers such as [TypeScript](http://www.typescriptlang.org/). Rather, it's to make it easy to help developers properly use a library you're built. If an API calls for a number as a parameter and you don't want to write extra code to make it work with anything else that might get thrown at it, this little library is for you!

## Installation

    npm install yllr
    bower install yllr

    // html file
    <script src="yllr.js"></script>

The library will detect and register itself into AMD and CommonJS environments before adding itself to the global namespace (i.e. `window`). Under AMD, it defines itself as the `yllr` module. As a global, it defines a new `yllr` property.

## Use In Code

This library provides a single `yllr.check()` function which throws an error if the condition isn't met.

Many existing assertion libraries provide extra specialized assertion functions to check for strict equality (`yllr.check(a === b)`), loose equality (`yllr.check(a == b)`), types (`yllr.check(_.isPlainObject(a))`, where `_` is typically [underscore](http://underscorejs.org/) or [lodash](https://lodash.com/)), etc.

Those specialized functions would unnecessarily bloat this library since a project usually already has an existing, consistent way of checking a condition.

With that in mind, instead of having code like this throughout your code base:

    function add(left, right) {
        if (typeof left !== 'number') {
            throw new MyAssertion('left must be a number: ' + left);
        }

        if (typeof right !== 'number') {
            throw new MyAssertion('right must be a number: ' + right);
        }

        return left + right;
    };

Note, in the code above, if `left` were an empty string, the resulting `error.message` would be `'left must be a number: '` -- not very helpful...

You can now use `yllr.check()` and just have nice (which looks much nicer, IMO):

    function add(left, right) {
        yllr.check(typeof left === 'number', 'left must be a number: {0}', [left]);
        yllr.check(typeof right === 'number', 'right must be a number: {0}', [right]);

        return left + right;
    };

Note now with the _token_ feature, if `left` were an empty string, the resulting `error.message` would be `'left must be a number: <empty>'`, which is immediately more helpful! No other special values are generated, however, since JavaScript provides adequate string representations of other built-in types:

*   `null.toString() === 'null'`
*   `undefined.toString() === 'undefined'`
*   `NaN.toString() === 'NaN'`
*   `false.toString() === 'false'`
*   `true.toString() === 'true'`

## Configuration

### Assertion Type

By default, the error thrown is an instance of `yllr.YllrError` which extends from the JavaScript `Error` type. In case your code base wants all errors throw to stem from the same base error type used throughout, the error type `yllr` generates can be customized:

    var MyError = function(message, tokens) {
        ...
    };

    yllr.config.setErrorType(MyError);
    yllr.check(false) // throws a new instance of `MyError`
    yllr.config.setErrorType(); // resets to throwing new `yllr.YllrError` instances

### Enable Checks

By default, checks are enabled, which means any `yllr.check()` call with a _falsy_ condition will assert. All checks can be enabled or disabled with a single call:

    yllr.config.enableChecks(false); // disable checks
    yllr.config.enableChecks(); // enable checks

## TODO

*   publish to NPM
*   publish to Bower
*   generate JSDocs as part of build -- generate in `/dist` but exclude from NPM and Bower? Would git load the HTML somehow, or can JSDoc produce Markdown-based output?
