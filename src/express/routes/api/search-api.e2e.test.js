'use strict';

const fs = require(`fs`).promises;
const server = require(`../../index`);
const request = require(`supertest`);

const FILE_NAME = `mock.json`;
const FIRST_MOCK_INDEX = 0;

describe(`Проверка REST API для работы с поиском`, () => {
  let mockArticle = null;

  beforeAll(async () => {
    mockArticle = JSON.parse((await fs.readFile(FILE_NAME)).toString())[FIRST_MOCK_INDEX];
  });

  test(`Поиск публикаций`, async () => {
    const result = await request(server).get(`/api/search?query=${encodeURIComponent(mockArticle.title)}`);
    expect(result.statusCode).toBe(200);
  });
});
