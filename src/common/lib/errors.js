'use strict';
class HttpError extends Error {
  constructor ( code,message ) {
    super()
    Error.captureStackTrace( this, this.constructor )
    this.name = 'HttpError'
    this.message = message
    this.status = code;
  }
}
module.exports = {
    HttpError
} 