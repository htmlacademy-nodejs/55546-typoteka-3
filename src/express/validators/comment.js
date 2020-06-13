'use strict';

const Joi = require(`@hapi/joi`);

module.exports = Joi.object({
  'text': Joi.string().min(20).max(255).required().messages({
    'string.min': `Минимальная длинна комментария {#limit} символа`,
    'string.max': `Максимальная длинна комментария {#limit} символа`,
    'string.required': `Поле обязательно к заполнению`,
  }),
  'date_create': Joi.date(),
});
