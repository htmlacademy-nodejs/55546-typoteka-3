'use strict';

const Joi = require(`@hapi/joi`);

const PASSWORD_MIN_LENGTH = 6;

const NameLength = {
  MIN: 3,
  MAX: 30
};

const login = {
  password: Joi.string().min(PASSWORD_MIN_LENGTH).required(),
  email: Joi.string().email().required(),
  _csrf: Joi.string().required()
};

module.exports = {
  register: Joi.object({
    ...login,
    name: Joi.string().pattern(/^([A-zА-я])*$/).min(NameLength.MIN).max(NameLength.MAX).required(),
    surname: Joi.string().pattern(/^([A-zА-я])*$/).min(NameLength.MIN).max(NameLength.MAX).required(),
    passwordAgain: Joi.ref(`password`),
    avatar: Joi.string().pattern(/\.(jpg|png)$/).required()
  }).with(`password`, `passwordAgain`),
  login: Joi.object(login)
};
