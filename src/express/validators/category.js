'use strict';

const Joi = require(`@hapi/joi`);

const TitleLength = {
  MIN: 5,
  MAX: 30,
};

module.exports = Joi.object({
  title: Joi.string().min(TitleLength.MIN).max(TitleLength.MAX).required().messages({
    'string.min': `Минимальная длинна названия категории {#limit} символа`,
    'string.max': `Максимальная длинна названия категории {#limit} символа`,
    'string.required': `Поле обязательно к заполнению`,
  })
});
