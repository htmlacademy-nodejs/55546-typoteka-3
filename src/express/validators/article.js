'use strict';

const Joi = require(`@hapi/joi`);

module.exports = Joi.object({
  'title': Joi.string().min(30).max(250).required().messages({
    'string.min': `Минимальная длинна заголовка {#limit} символа`,
    'string.max': `Максимальная длинна заголовка {#limit} символа`,
    'string.required': `Поле обязательно к заполнению`,
  }),
  'img': Joi.string(),
  'announce': Joi.string().min(30).max(250).required(),
  'full_text': Joi.string().max(1000),
  'categories': Joi.array().items(Joi.number().required()).required(),
  'date_create': Joi.date().required(),
  'author_id': Joi.number().required(),
});
