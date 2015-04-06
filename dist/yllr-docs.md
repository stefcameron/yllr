# API Documentation
Version 0.0.2

<a name="yllr"></a>
#yllr
The `yllr` library.

**Members**

* [yllr](#yllr)
  * [yllr.check(condition, [message], [tokens])](#yllr.check)
  * [yllr.config](#yllr.config)
    * [config.setErrorType([errorType])](#yllr.config.setErrorType)
    * [config.enableChecks([enable])](#yllr.config.enableChecks)
  * [class: yllr.YllrError](#yllr.YllrError)
    * [new yllr.YllrError(message, [tokens])](#new_yllr.YllrError)

<a name="yllr.check"></a>
##yllr.check(condition, [message], [tokens])
Perform a runtime check.

**Params**

- condition `*` - Condition to check. If _truthy_, the check passes and
 nothing happens. If _falsy_, the check fails, causing a new error to be
 thrown with the specified message.  
- \[message\] `String` - Optional message. A generic message is used if
 one is not provided.  
- \[tokens\] `Array.<String>` - Optional substitution tokens for the
 `message`, passed to the generated error.  

<a name="yllr.config"></a>
##yllr.config
Configuration options.

**Members**

* [yllr.config](#yllr.config)
  * [config.setErrorType([errorType])](#yllr.config.setErrorType)
  * [config.enableChecks([enable])](#yllr.config.enableChecks)

<a name="yllr.config.setErrorType"></a>
###config.setErrorType([errorType])
Customizes the type of error thrown when a `check` fails.

**Params**

- \[errorType\] `function` - If specified, expected to be a constructor
 function which has the same signature as the default `YllrError`. If
 falsy, resets the error type to `YllrError`.  

<a name="yllr.config.enableChecks"></a>
###config.enableChecks([enable])
Allows enabling or disabling all checks. Subsequent calls to `yllr.check`
 will cause failures if enabled, or do nothing if disabled.

**Params**

- \[enable=true\] `Boolean` - If _truthy_ (or unspecified), checks are
 enabled; otherwise, checks are disabled.  

<a name="yllr.YllrError"></a>
##class: yllr.YllrError
**Members**

* [class: yllr.YllrError](#yllr.YllrError)
  * [new yllr.YllrError(message, [tokens])](#new_yllr.YllrError)

<a name="new_yllr.YllrError"></a>
###new yllr.YllrError(message, [tokens])
[[extends: `JavaScript.Error`]]
Defines the error that is thrown by default when a check fails.
 `error.name` is set to `yllrError`.

**Params**

- message `String` - The error message.  
- \[tokens\] `Array.<String>` - Optional tokens to substitute into the
 `message` specified. If tokens are provided, `message` is expected to
 contain substitution tokens using the `{n}` syntax where `n` is a zero-based
 index matching a token string found in `tokens`.  

