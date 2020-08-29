'use strict';

const Joi = require(`@hapi/joi`);

const TitleLength = {
  MIN: 30,
  MAX: 250,
};

const AnnounceLength = {
  MIN: 30,
  MAX: 250,
};

const MAX_FULL_TEXT_COUNT = 1000;

module.exports = Joi.object({
  title: Joi.string().min(TitleLength.MIN).max(TitleLength.MAX).required().messages({
    'string.min': `Минимальная длинна заголовка {#limit} символа`,
    'string.max': `Максимальная длинна заголовка {#limit} символа`,
    'string.required': `Поле обязательно к заполнению`,
  }),
  img: Joi.string().pattern(/\.(jpg|png)$/),
  announce: Joi.string().min(AnnounceLength.MIN).max(AnnounceLength.MAX).required(),
  fullText: Joi.string().max(MAX_FULL_TEXT_COUNT).allow(``),
  categories: Joi.array().items(Joi.any().required()).required(),
  dateCreate: Joi.any().required(),
  authorId: Joi.number().required(),
});
