# yllr

Minimal runtime assertion library.

## Installation

    npm install yllr
    bower install yllr

    // html file
    <script src="yllr.js"></script>

The library will property register itself into AMD and CommonJS environments. Otherwise, it will create a `yllr` property in the global namespace (e.g. browser `window`, or whatever `this` happens to be).

## Configuration

Configuration is optional. By default, the error thrown is an instance of `yllr.YllrError` which extends from the JavaScript `Error` type.

    var MyError = function(message, tokens) {
        ...
    };

    yllr.config.setErrorType(MyError);

## TODO

*   add unit tests
*   integrate with Travis
*   generate JSDocs as part of build -- how to distribute?
