'use strict';

const schema = require(`./article`);

const mock = {
  'title': `Тестовый заголовок`,
  'img': `path/img.jpg`,
  'announce': `Article text announce...`,
  'full_text': `Article full_text info...`,
  'categories': [3, 5, 7],
  'author_id': 1,
  'date_create': new Date(),
};

describe(`Проверка валидации статьи`, () => {
  test(`Корректна валидация`, async () => {
    let result = null;
    try {
      result = await schema.validateAsync(mock);
    } catch (err) {
      //
    }

    expect(result).toStrictEqual(mock);
  });

  test(`Валидация с недостаточной длинной заголовка`, async () => {
    let result = null;

    mock.title = ``;

    try {
      result = await schema.validateAsync(mock);
    } catch (err) {
      //
    }

    expect(result).toEqual(null);
  });

  test(`Валидация с некорректным типом изображения`, async () => {
    let result = null;

    mock.img = 123;

    try {
      result = await schema.validateAsync(mock);
    } catch (err) {
      //
    }

    expect(result).toEqual(null);
  });

  test(`Валидация с некорректным списком категорий`, async () => {
    let result = null;

    mock.categories = [`1`, null, false];

    try {
      result = await schema.validateAsync(mock);
    } catch (err) {
      //
    }

    expect(result).toEqual(null);
  });

  test(`Валидация с некорректным значением идентификатора автора`, async () => {
    let result = null;

    mock[`author_id`] = `1`;

    try {
      result = await schema.validateAsync(mock);
    } catch (err) {
      //
    }

    expect(result).toEqual(null);
  });

  test(`Валидация с не корректной датой`, async () => {
    let result = null;

    mock[`date_create`] = `Дата`;

    try {
      result = await schema.validateAsync(mock);
    } catch (err) {
      //
    }

    expect(result).toEqual(null);
  });
});
