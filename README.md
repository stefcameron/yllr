# yllr

[![Build Status](https://travis-ci.org/stefcameron/yllr.svg?branch=master)](https://travis-ci.org/stefcameron/yllr)

[![NPM](https://nodei.co/npm/yllr.png?compact=true)](https://nodei.co/npm/yllr/)

Minimal runtime assertion library.

## Goal

This library aims to be __small__. The current release comes in around 1.75KB in its minified form. It has just enough functionality (i.e. _syntactic sugar_) to make it easy to add and manage runtime assertions in your code base.

The goal is not to replace static code analysis provided by transpilers such as [TypeScript](http://www.typescriptlang.org/). Rather, it's to make it easy to help developers properly use a library you've built. If an API calls for a number as a parameter and you don't want to write extra code to make it work with anything else that might get thrown at it, this little library is for you!

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

With that in mind, instead of having code like this throughout your code base...

```javascript
function add(left, right) {
    if (typeof left !== 'number') {
        throw new MyAssertion('left must be a number: ' + left);
    }

    if (typeof right !== 'number') {
        throw new MyAssertion('right must be a number: ' + right);
    }

    return left + right;
};
```

(note, in the code above, if `left` were an empty string, the resulting `error.message` would be `'left must be a number: '` -- not very helpful!)

...you can now use `yllr.check()`, which looks much nicer and is easily identified as an assertion (and allows to you instantly turn them all on/off with [`yllr.config.enableChecks()`](#enable-checks)):

```javascript
function add(left, right) {
    yllr.check(typeof left === 'number', 'left must be a number: {0}', left);
    yllr.check(typeof right === 'number', 'right must be a number: {0}', right);

    return left + right;
};
```

Note now with the _token_ feature, if `left` were an empty string, the resulting `error.message` would be `'left must be a number: <empty>'`, which is immediately more helpful! No other special values are generated, however, since JavaScript provides adequate string representations of other built-in types:

*   `null.toString() === 'null'`
*   `undefined.toString() === 'undefined'`
*   `NaN.toString() === 'NaN'`
*   `false.toString() === 'false'`
*   `true.toString() === 'true'`

Finally, the `condition` parameter can optionally be a function that returns a _truthy_ or _falsy_ value. By using a function, it ensures that any potentially expensive condition evaluation code is only executed if `yllr` checks are enabled (see [API docs](dist/yllr-docs.md) on enabling/disabling checks).

### Contextual Checks

The `yllr.make(context)` creates a _contextual_ `yllr` object which has the same interface as the global `yllr` object (exception for `yllr.config` and `yllr.make`), the difference being that errors thrown from this object's `check()` method get an additional context string when they're created. The `yllr.YllrError` object has a `context` property that is set to this value, and the constructor of any custom error type will also get this context as a parameter.

The main advantage of a contextual `yllr` object's `check()` method over the generic `yllr.check()` is the context. Each browser deals with uncaught errors and logged errors in different ways, and error stacks, especially resulting from an asynchronous call (e.g. promise resolutions) are often meaningless. This simple context string, if set judiciously, can greatly simplify debugging by providing a crucial hint about the source of the failed check.

When converting a `yllr.YllrError` instance to a string, the output looks like this:
*    With context: `YllrError: <context>: <message>`
*    Without context: `YllrError: <message>`

## Configuration

### Assertion Type

By default, the error thrown is an instance of `yllr.YllrError` which extends from the JavaScript `Error` type. In case your code base wants all errors throw to stem from the same base error type used throughout, the error type `yllr` generates can be customized:

```javascript
var MyError = function(message, tokens) {
    ...
};

yllr.config.setErrorType(MyError);
yllr.check(false) // throws a new instance of `MyError`
yllr.config.setErrorType(); // resets to throwing new `yllr.YllrError` instances
```

### Enable Checks

By default, checks are enabled, which means any `yllr.check()` call with a _falsy_ condition will assert. All checks can be enabled or disabled with a single call:

```javascript
yllr.config.enableChecks(false); // disable checks
yllr.config.enableChecks(); // enable checks
```

## Documentation

Refer to the generated [API Documentation](dist/yllr-docs.md).

## Customization

Custom check can easily be added to an instance of `yllr` for your project's specific needs. Let's say you want to make it easy to check the type of variable, parameter, property, etc. You might want to add a `checkType()` method to `yllr` as well as any contextual `yllr` objects that might get created:

```javascript
// somewhere in your project's bootstrap sequence...
(function() {
    // @param {*|Function} condition Condition to check.
    // @param {String} name Name of property, variable, parameter being checked.
    // @param {(String|Array.<String>)} types Expected type, or list of expected types.
    // @param {*} value Value that was checked.
    var checkType = function(condition, name, types, value) {
        types = (Object.prototype.toString.call(types) !== '[object Array]') ?
                [types] : types;
        this.check(condition, '{0}: expected {1}, got {2}', name, types.join(' or '),
                value);
    };

    yllr.checkType = checkType; // add to global yllr

    (function(yllrMake) {
        yllr.make = function(context) {
            var ctxYllr = yllrMake.call(this, context);

            ctxYllr.checkType = checkType; // add to contextual yllr

            return ctxYllr;
        };
    })(yllr.make);
})();

var foo = 1;
yllr.checkType(typeof foo === 'string', 'foo', 'string', foo);
// throws YllrError with message 'foo: expected string, got 1'

function bar(param) {
    yllr.checkType(function() {
        var isArray = (Object.prototype.toString.call(param) !== '[object Array]');
        return !param || (typeof param === 'string') || isArray;
    }, 'param', ['falsy', 'string', 'array[string]'], param);

    // ...
};

bar(2);
// throws YllrError with message
// 'param: expected falsy or string or array[string], got 2'
```

## History

### 1.1.0

*   Updated all dependencies to their latest versions. No functionality changes.

### 1.0.0

#### Enhancements

*   `yllr.make()` now accepts any non-`undefined` value as a context.
*   Contextual `yllr` object now has a `context():string` method that returns the specified context.
*   New `yllr.onFail()` handler (also on contextual `yllr` objects) allows failed check behavior to be customized (e.g. to result in a failed assertion in NodeJS which produces a nice stack trace).
*   New `yllr.tokenize()` is used to defer token substitution in tokenized messages so that custom failure handlers don't have to worry about having to understand how to substitute tokens in messages.

#### Bug Fixes

*   Only the first occurrence of a token would be replaced with its associated value. All occurrences are now replaced with its value.

#### Breaking Changes

*   When instantiating a new error resulting from a failed check, the error constructor is no longer called with tokens. The expected signature is now `function(message:String, context:*)` and `message` contains substituted token values.

#### Other Changes

*   Updated all package dependencies to comply with npm3 peer dependency changes.
*   Added `karma:globaldebug` grunt target for debugging unit tests in the global deployment scenario.

### 0.0.5

*    New `yllr.make(context)` makes new contextual `yllr` objects.
*    New `yllr.config.noConflict()` method.
*    Updated default error name to be `'YllrError'` instead of `'yllrError'`, which is more in line with standard JavaScript error names like `'Error'`, `'TypeError'`, `'SyntaxError'`, etc.
*    Updated all package dependencies.

### 0.0.4

*   `yllr.check()`'s `condition` parameter can now optionally be a function which evaluates to the condition result. This ensures that condition checking code is only executed IIF checks are enabled.

### 0.0.3

*   Added `yllr.config.checksEnabled()` to compliment `yllr.config.enableChecks()`.
*   Added support for the rest parameter of `yllr.check()` as alternate substitution tokens (to using an array with tokens). This makes the function more similar to some common string formatting methods in NodeJS (e.g. `debug('foo %s', 'bar'); // foo bar` using the handy [debug](https://github.com/visionmedia/debug) library).
*   Updated [grunt-jsdoc-to-markdown](https://github.com/jsdoc2md/grunt-jsdoc-to-markdown) dependency which uses the latest (1.1.1 at this time) [jsdoc-to-markdown](https://github.com/jsdoc2md/jsdoc-to-markdown) library. This adds support for the `@see` tag which is useful.

### 0.0.2

Added [API Documentation](dist/yllr-docs.md).

### 0.0.1

Initial release.
