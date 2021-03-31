const { StatusCodes } = require('http-status-codes');

class BadInputError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = { BadInputError };
