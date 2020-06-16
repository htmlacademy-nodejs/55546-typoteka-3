'use strict';

const schema = require(`./comment`);

const mock = {
  'text': `Тестовый комментарний для проверки валидации...`,
  'date_create': new Date(),
};

describe(`Проверка валидации комментария`, () => {
  test(`Корректна валидация`, async () => {
    let res = null;
    try {
      res = await schema.validateAsync(mock);
    } catch (err) {
      //
    }

    expect(res).toStrictEqual(mock);
  });

  test(`Валидация с недостаточной длинной сообщения`, async () => {
    let res = null;

    mock.text = `Короткая строка`;

    try {
      res = await schema.validateAsync(mock);
    } catch (err) {
      //
    }

    expect(res).toEqual(null);
  });

  test(`Валидация с не корректной датой`, async () => {
    let res = null;

    mock[`date_create`] = `Дата`;

    try {
      res = await schema.validateAsync(mock);
    } catch (err) {
      //
    }

    expect(res).toEqual(null);
  });
});
