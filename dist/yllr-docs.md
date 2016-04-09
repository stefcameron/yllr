# API Documentation
Version 1.0.0

<a name="yllr"></a>

# yllr : <code>object</code>
The `yllr` library.

**Kind**: global namespace  

* [yllr](#yllr) : <code>object</code>
    * [.YllrError](#yllr.YllrError)
        * [new YllrError(message, [context])](#new_yllr.YllrError_new)
        * [.message](#yllr.YllrError+message) : <code>String</code>
        * [.name](#yllr.YllrError+name) : <code>String</code>
        * [.context](#yllr.YllrError+context) : <code>Object</code> &#124; <code>undefined</code>
        * [.toString()](#yllr.YllrError+toString) ⇒ <code>String</code>
    * [.Yllr](#yllr.Yllr)
        * [new Yllr()](#new_yllr.Yllr_new)
        * [.context](#yllr.Yllr+context) : <code>Object</code>
        * [.check(condition, [message], [...tokens])](#yllr.Yllr+check)
        * [.onFail(message, tokens)](#yllr.Yllr+onFail)
    * [.config](#yllr.config) : <code>object</code>
        * [.noConflict()](#yllr.config.noConflict) ⇒ <code>[yllr](#yllr)</code>
        * [.setErrorType([ErrorType])](#yllr.config.setErrorType)
        * [.enableChecks([enable])](#yllr.config.enableChecks)
        * [.checksEnabled()](#yllr.config.checksEnabled) ⇒ <code>Boolean</code>
    * [.tokenize(message, tokens, [context])](#yllr.tokenize) ⇒ <code>String</code>
    * [.onFail(message, tokens)](#yllr.onFail)
    * [.check(condition, [message], [...tokens])](#yllr.check)
    * [.make(context)](#yllr.make)

<a name="yllr.YllrError"></a>

## yllr.YllrError
**Kind**: static class of <code>[yllr](#yllr)</code>  
**See**: [`yllr.make`](#yllr.make)  

* [.YllrError](#yllr.YllrError)
    * [new YllrError(message, [context])](#new_yllr.YllrError_new)
    * [.message](#yllr.YllrError+message) : <code>String</code>
    * [.name](#yllr.YllrError+name) : <code>String</code>
    * [.context](#yllr.YllrError+context) : <code>Object</code> &#124; <code>undefined</code>
    * [.toString()](#yllr.YllrError+toString) ⇒ <code>String</code>

<a name="new_yllr.YllrError_new"></a>

### new YllrError(message, [context])
[[extends: `JavaScript.Error`]]
Defines the error that is thrown by default when a check fails.
 `error.name` is set to `YllrError`.


| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> | The error message. |
| [context] | <code>Object</code> &#124; <code>undefined</code> | Optional context object to associate  with the error. An `undefined` value equates to no context. If this error  is being instantiated from a _contextual yllr object_, this parameter should  be the associated context. |

<a name="yllr.YllrError+message"></a>

### yllrError.message : <code>String</code>
Error message.

**Kind**: instance property of <code>[YllrError](#yllr.YllrError)</code>  
<a name="yllr.YllrError+name"></a>

### yllrError.name : <code>String</code>
Error name/code.

**Kind**: instance property of <code>[YllrError](#yllr.YllrError)</code>  
<a name="yllr.YllrError+context"></a>

### yllrError.context : <code>Object</code> &#124; <code>undefined</code>
Error context, if specified; `undefined` if there is no context.

**Kind**: instance property of <code>[YllrError](#yllr.YllrError)</code>  
<a name="yllr.YllrError+toString"></a>

### yllrError.toString() ⇒ <code>String</code>
[[overrides: `JavaScript.Error.toString()`]]
Generates a string representation of this error.

**Kind**: instance method of <code>[YllrError](#yllr.YllrError)</code>  
**Returns**: <code>String</code> - A string representation of this error.  
<a name="yllr.Yllr"></a>

## yllr.Yllr
**Kind**: static class of <code>[yllr](#yllr)</code>  

* [.Yllr](#yllr.Yllr)
    * [new Yllr()](#new_yllr.Yllr_new)
    * [.context](#yllr.Yllr+context) : <code>Object</code>
    * [.check(condition, [message], [...tokens])](#yllr.Yllr+check)
    * [.onFail(message, tokens)](#yllr.Yllr+onFail)

<a name="new_yllr.Yllr_new"></a>

### new Yllr()
Contextual yllr object. It has the same interface as the library's main
 functions (with the exception of [`yllr.make`](#yllr.make)), with the
 addition of an associated context to help with debugging (for instance,
 to make it easier to identify the source of the failure).

<a name="yllr.Yllr+context"></a>

### yllr.context : <code>Object</code>
The context associated with this `yllr` object. Note that `null` is
 technically an object and therefore a valid context. This property
 should not be `undefined` given how [`yllr.make()`](#yllr.make) works.

**Kind**: instance property of <code>[Yllr](#yllr.Yllr)</code>  
<a name="yllr.Yllr+check"></a>

### yllr.check(condition, [message], [...tokens])
Perform a contextual condition check.

**Kind**: instance method of <code>[Yllr](#yllr.Yllr)</code>  
**See**: [`yllr.check`](#yllr.check)  

| Param | Type | Description |
| --- | --- | --- |
| condition | <code>\*</code> | Condition to check. |
| [message] | <code>String</code> | Optional message. |
| [...tokens] | <code>String</code> | Optional substitution tokens. |

<a name="yllr.Yllr+onFail"></a>

### yllr.onFail(message, tokens)
Handle a contextual check failure.

Override this method to customize the behavior of a failed contextual
 check.

**Kind**: instance method of <code>[Yllr](#yllr.Yllr)</code>  
**See**: [`yllr.onFail`](#yllr.onFail)  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> &#124; <code>undefined</code> | Associated message, if any. |
| tokens | <code>Array</code> | Tokens, if any; empty if none. |

<a name="yllr.config"></a>

## yllr.config : <code>object</code>
Configuration options.

**Kind**: static namespace of <code>[yllr](#yllr)</code>  

* [.config](#yllr.config) : <code>object</code>
    * [.noConflict()](#yllr.config.noConflict) ⇒ <code>[yllr](#yllr)</code>
    * [.setErrorType([ErrorType])](#yllr.config.setErrorType)
    * [.enableChecks([enable])](#yllr.config.enableChecks)
    * [.checksEnabled()](#yllr.config.checksEnabled) ⇒ <code>Boolean</code>

<a name="yllr.config.noConflict"></a>

### config.noConflict() ⇒ <code>[yllr](#yllr)</code>
Restores the previous value of `global.yllr` (i.e. `window.yllr`) and
 returns a reference to the `yllr` library.

This configuration function only exists if the library was registered
 into the global namespace. It will not exist if it was registered as
 an AMD or CommonJS module.

Once this function is called, it will be removed (i.e. it can only be
 called once).

**Kind**: static method of <code>[config](#yllr.config)</code>  
**Returns**: <code>[yllr](#yllr)</code> - Reference to the `yllr` library.  
<a name="yllr.config.setErrorType"></a>

### config.setErrorType([ErrorType])
Customizes the type of error thrown when a `check` fails.

**Kind**: static method of <code>[config](#yllr.config)</code>  
**See**: [`yllr.YllrError`](#yllr.YllrError)  

| Param | Type | Description |
| --- | --- | --- |
| [ErrorType] | <code>function</code> | If specified, expected to be a constructor  function which has the same signature as the default `YllrError`. If  not a function, resets the error type to `YllrError`. |

<a name="yllr.config.enableChecks"></a>

### config.enableChecks([enable])
Allows enabling or disabling all checks. Subsequent calls to `yllr.check`
 will cause failures if enabled, or do nothing if disabled.

**Kind**: static method of <code>[config](#yllr.config)</code>  
**See**: [`yllr.config.checksEnabled()`](#yllr.config.checksEnabled)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [enable] | <code>Boolean</code> | <code>true</code> | If _truthy_ (or unspecified), checks are  enabled; otherwise, checks are disabled. |

<a name="yllr.config.checksEnabled"></a>

### config.checksEnabled() ⇒ <code>Boolean</code>
Determines if all checks are enabled; a compliment to `config.enableChecks()`.

**Kind**: static method of <code>[config](#yllr.config)</code>  
**Returns**: <code>Boolean</code> - `true` if all checks are enabled; `false` otherwise.  
**See**: [`yllr.config.enableChecks()`](#yllr.config.enableChecks)  
<a name="yllr.tokenize"></a>

## yllr.tokenize(message, tokens, [context]) ⇒ <code>String</code>
Replace any tokens in a given message.

**Kind**: static method of <code>[yllr](#yllr)</code>  
**Returns**: <code>String</code> - Message with tokens substituted; empty string if `message`
 was _falsy_.  

| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> | Message containing `{n}`-style tokens. If _falsy_,  it's considered to be an empty strig. |
| tokens | <code>Array</code> | Token values. Any tokens which aren't strings are  cast to strings. |
| [context] | <code>Object</code> &#124; <code>undefined</code> | Optional context associated with the  `message`. An `undefined` value equates to no context. __Note:__ the current  implementation ignores this parameter. |

<a name="yllr.onFail"></a>

## yllr.onFail(message, tokens)
Handle a failed check. The default behavior is to throw a new instance
 of the [configured error type](#yllr.config.setErrorType).

Override this method to customize the behavior of a failed check:

```javascript
//// Global checks:
yllr.onFail = function(message, tokens) {
  // custom code...
};
```

```javascript
//// Contextual checks (per-instance):
var y = yllr.make('myFunction');
y.onFail = function(message, tokens) {
  // custom code...
};
```

```javascript
//// Contextual checks (all instances):
(function(yllrMake) {
  var ctxOnFail = function(message, tokens) {
    // custom code...
  };
  yllr.make = function(context) {
    var y = yllrMake.call(this, context);
    y.onFail = ctxOnFail;
    return y;
  };
})(yllr.make);
```

**Kind**: static method of <code>[yllr](#yllr)</code>  
**See**

- [`yllr.check()`](#yllr.check)
- [`yllr.Yllr#check()`](#yllr.Yllr+check)
- [`yllr.Yllr#onFail()`](#yllr.Yllr+onFail)


| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> &#124; <code>undefined</code> | Failed check message (may contain tokens).  If _falsy_ (because a message wasn't provided for the failed check), a default  message is used. The [tokenize](#yllr.tokenize) function is used to substitute any  tokens into the `message`. |
| tokens | <code>Array</code> | Token values to substitute into `message`. Empty  array if none were given for the failed check. |

<a name="yllr.check"></a>

## yllr.check(condition, [message], [...tokens])
Check a condition.

**Kind**: static method of <code>[yllr](#yllr)</code>  
**See**

- [`yllr.make`](#yllr.make)
- [`yllr.config.enableChecks`](#yllr.config.enableChecks)


| Param | Type | Description |
| --- | --- | --- |
| condition | <code>\*</code> | Condition to check. If _truthy_, the check passes and  nothing happens. If _falsy_, the check fails, causing a new error to be  thrown with the specified message.  If the `condition` is a function, it's expected to be one which returns  a _truthy_ or _falsy_ value. Using a function ensures that the condition  evaluation code is truly only executed IIF checks are enabled. |
| [message] | <code>String</code> | Optional message. A generic message is used if  one is not provided. |
| [...tokens] | <code>String</code> | Optional substitution tokens for the  `message`, passed to the generated error. This can be specified either as  a _single_ `Array.<String>` parameter (in which case each element is considered  to be a token), or as multiple parameters (in which case arrays are treated  as tokens, not their elements).  When using the single array parameter, an array can be passed as a single   token by wrapping it in the token array: `[[1, 2, 3], 'a']` would result   in two tokens, the first being an `Array.<Number>` and the second being   a `String`. This is the exception if you need to pass one token and it   happens to be an array. |

<a name="yllr.make"></a>

## yllr.make(context)
Make a new contextual `yllr` object. The `context` is passed to the
 [error type](#yllr.config.setErrorType) constructor when a check fails.

**Kind**: static method of <code>[yllr](#yllr)</code>  

| Param | Type | Description |
| --- | --- | --- |
| context | <code>Object</code> | Associated context. Can be any value except `undefined`;  normally a `String`. If `undefined`, will be interpreted as `null`. |

