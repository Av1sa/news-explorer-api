const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');
const { secretKey } = require('../utils/utils');
const { NotFoundError } = require('../errors/NotFoundError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const { ConflictError } = require('../errors/ConflictError');
const ErrorMessages = require('../utils/error-messages');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
      }
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.send({ id: user._id, email: user.email, name: user.name }))
    .catch(() => next(new ConflictError(ErrorMessages.USER_ALREADY_EXISTS)));
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnauthorizedError(ErrorMessages.INCORRECT_PASSWORD_OR_EMAIL),
        );
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(
            new UnauthorizedError(ErrorMessages.INCORRECT_PASSWORD_OR_EMAIL),
          );
        }
        return user;
      });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, secretKey, {
        expiresIn: '7d',
      });
      return res.status(StatusCodes.OK).send({ token });
    })
    .catch(next);
};

module.exports = {
  getCurrentUser,
  createUser,
  loginUser,
};
