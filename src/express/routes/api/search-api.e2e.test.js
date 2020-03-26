'use strict';

const fs = require(`fs`).promises;
const server = require(`../../index`);
const request = require(`supertest`);

describe(`Проверка REST API для работы с поиском`, () => {
  let mockOffer = null;

  beforeAll(async () => {
    mockOffer = JSON.parse((await fs.readFile(`mock.json`)).toString())[0];
  });

  test(`Поиск публикаций`, async () => {
    const res = await request(server).get(`/api/search?query=${encodeURIComponent(mockOffer.title)}`);
    expect(res.statusCode).toBe(200);
  });
});
