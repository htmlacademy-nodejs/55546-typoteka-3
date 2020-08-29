'use strict';

const schema = require(`./comment`);

const mock = {
  'text': `Тестовый комментарний для проверки валидации...`,
  'dateCreate': new Date(),
};

describe(`Проверка валидации комментария`, () => {
  test(`Корректна валидация`, async () => {
    let result = null;
    try {
      result = await schema.validateAsync(mock);
    } catch (err) {
      //
    }

    expect(result).toStrictEqual(mock);
  });

  test(`Валидация с недостаточной длинной сообщения`, async () => {
    let result = null;

    mock.text = `Короткая строка`;

    try {
      result = await schema.validateAsync(mock);
    } catch (err) {
      //
    }

    expect(result).toEqual(null);
  });

  test(`Валидация с не корректной датой`, async () => {
    let result = null;

    mock.dateCreate = `Дата`;

    try {
      result = await schema.validateAsync(mock);
    } catch (err) {
      //
    }

    expect(result).toEqual(null);
  });
});
