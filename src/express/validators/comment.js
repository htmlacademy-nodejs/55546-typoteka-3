'use strict';

const Joi = require(`@hapi/joi`);

const TextLength = {
  MIN: 20,
  MAX: 255,
};

module.exports = Joi.object({
  text: Joi.string().min(TextLength.MIN).max(TextLength.MAX).required().messages({
    'string.min': `Минимальная длинна комментария {#limit} символа`,
    'string.max': `Максимальная длинна комментария {#limit} символа`,
    'string.required': `Поле обязательно к заполнению`,
  }),
  articleId: Joi.any().required(),
  authorId: Joi.any().required(),
  dateCreate: Joi.date(),
});
