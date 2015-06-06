# API Documentation
Version 0.0.3

<a name="yllr"></a>
# yllr : <code>object</code>
The `yllr` library.

**Kind**: global namespace  

* [yllr](#yllr) : <code>object</code>
  * [.YllrError](#yllr.YllrError)
    * [new YllrError(message, [tokens])](#new_yllr.YllrError_new)
  * [.config](#yllr.config) : <code>object</code>
    * [.setErrorType([errorType])](#yllr.config.setErrorType)
    * [.enableChecks([enable])](#yllr.config.enableChecks)
    * [.checksEnabled()](#yllr.config.checksEnabled) ⇒ <code>Boolean</code>
  * [.check(condition, [message], [...tokens])](#yllr.check)

<a name="yllr.YllrError"></a>
## yllr.YllrError
**Kind**: static class of <code>[yllr](#yllr)</code>  
<a name="new_yllr.YllrError_new"></a>
### new YllrError(message, [tokens])
[[extends: `JavaScript.Error`]]
Defines the error that is thrown by default when a check fails.
 `error.name` is set to `yllrError`.


| Param | Type | Description |
| --- | --- | --- |
| message | <code>String</code> | The error message. |
| [tokens] | <code>Array.&lt;String&gt;</code> | Optional tokens to substitute into the  `message` specified. If tokens are provided, `message` is expected to  contain substitution tokens using the `{n}` syntax where `n` is a zero-based  index matching a token string found in `tokens`. |

<a name="yllr.config"></a>
## yllr.config : <code>object</code>
Configuration options.

**Kind**: static namespace of <code>[yllr](#yllr)</code>  

* [.config](#yllr.config) : <code>object</code>
  * [.setErrorType([errorType])](#yllr.config.setErrorType)
  * [.enableChecks([enable])](#yllr.config.enableChecks)
  * [.checksEnabled()](#yllr.config.checksEnabled) ⇒ <code>Boolean</code>

<a name="yllr.config.setErrorType"></a>
### config.setErrorType([errorType])
Customizes the type of error thrown when a `check` fails.

**Kind**: static method of <code>[config](#yllr.config)</code>  
**See**: [`yllr.YllrError`](#yllr.YllrError)  

| Param | Type | Description |
| --- | --- | --- |
| [errorType] | <code>function</code> | If specified, expected to be a constructor  function which has the same signature as the default `YllrError`. If  falsy, resets the error type to `YllrError`. |

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
<a name="yllr.check"></a>
## yllr.check(condition, [message], [...tokens])
Perform a runtime check.

**Kind**: static method of <code>[yllr](#yllr)</code>  

| Param | Type | Description |
| --- | --- | --- |
| condition | <code>\*</code> | Condition to check. If _truthy_, the check passes and  nothing happens. If _falsy_, the check fails, causing a new error to be  thrown with the specified message. |
| [message] | <code>String</code> | Optional message. A generic message is used if  one is not provided. |
| [...tokens] | <code>String</code> | Optional substitution tokens for the  `message`, passed to the generated error. This can be specified either as  a _single_ `Array.<String>` parameter (in which case each element is considered  to be a token), or as multiple parameters (in which case arrays are treated  as tokens, not their elements).  When using the single array parameter, an array can be passed as a single   token by wrapping it in the token array: `[[1, 2, 3], 'a']` would result   in two tokens, the first being an `Array.<Number>` and the second being   a `String`. This is the exception if you need to pass one token and it   happens to be an array. |

