'use strict';

class HttpError extends Error {
    constructor(statusCode, message, code) {
        super()
        Error.captureStackTrace(this, this.constructor)
        this.name = 'HttpError'
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
    }
}

module.exports = { HttpError }