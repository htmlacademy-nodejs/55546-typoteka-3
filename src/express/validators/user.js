'use strict';

const Joi = require(`@hapi/joi`);

const login = {
  'password': Joi.string().min(3).required(),
  'email': Joi.string().email().required(),
  '_csrf': Joi.string().required()
};

module.exports = {
  register: Joi.object({
    ...login,
    'name': Joi.string().alphanum().min(3).max(30).required(),
    'surname': Joi.string().alphanum().min(3).max(30).required(),
    'password-again': Joi.ref(`password`),
    'avatar': Joi.string().required()
  }).with(`password`, `password-again`),
  login: Joi.object(login)
};
