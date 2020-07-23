'use strict';

const Joi = require(`@hapi/joi`);

module.exports = Joi.object({
  'title': Joi.string().min(5).max(30).required().messages({
    'string.min': `Минимальная длинна названия категории {#limit} символа`,
    'string.max': `Максимальная длинна названия категории {#limit} символа`,
    'string.required': `Поле обязательно к заполнению`,
  })
});
