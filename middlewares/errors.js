const StatusCodes = require('http-status-codes');

module.exports = (err, req, res, next) => {
  const { statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === StatusCodes.INTERNAL_SERVER_ERROR
        ? 'An error occurred on the server'
        : message,
  });
};
