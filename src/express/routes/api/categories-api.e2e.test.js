'use strict';

const request = require(`supertest`);
const server = require(`../../index`);
const {HttpCode} = require(`../../../http-code`);

describe(`Проверка REST API для работы с категориями`, () => {
  test(`Получение всех категорий`, async () => {
    const result = await request(server).get(`/api/categories`);
    expect(result.statusCode).toBe(HttpCode.OK);
  });
});
