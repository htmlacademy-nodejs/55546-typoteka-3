'use strict';

const Joi = require(`@hapi/joi`);

const login = {
  'password': Joi.string().min(6).required(),
  'email': Joi.string().email().required(),
  '_csrf': Joi.string().required()
};

module.exports = {
  register: Joi.object({
    ...login,
    'name': Joi.string().pattern(/^([A-zА-я]{3,30})$/).required(),
    'surname': Joi.string().pattern(/^([A-zА-я]{3,30})$/).required(),
    'password-again': Joi.ref(`password`),
    'avatar': Joi.string().pattern(/\.(jpg|png)$/).required()
  }).with(`password`, `password-again`),
  login: Joi.object(login)
};
