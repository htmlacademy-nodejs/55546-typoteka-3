'use strict';

const fs = require(`fs`).promises;
const server = require(`../../index`);
const request = require(`supertest`);
const {HttpCode: {OK, BAD_REQUEST}} = require(`../../../http-code`);

describe(`Проверка REST API для работы со списком публикаций`, () => {
  const FAKE_ARTICLE_ID = `9Gc4QREIT1EiNQQuGD3YU2`;
  const FAKE_COMMENT_ID = `9Gc4QREIT1EiNQQuGD3YU2`;

  const FIRST_ARTICLE_INDEX = 0;
  const FIRST_ARTICLE_COMMENT_INDEX = 0;

  let mockArticle = null;
  let REAL_ARTICLE_ID = null;
  let REAL_COMMENT_ID = null;

  beforeAll(async () => {
    mockArticle = JSON.parse((await fs.readFile(`mock.json`)).toString())[FIRST_ARTICLE_INDEX];
    REAL_ARTICLE_ID = mockArticle.id;
    REAL_COMMENT_ID = mockArticle.comments[FIRST_ARTICLE_COMMENT_INDEX].id;
  });

  test(`Получение всех публикаций`, async () => {
    const result = await request(server).get(`/api/articles`);
    expect(result.statusCode).toBe(OK);
  });

  test(`Получение конкретной публикации по ID`, async () => {
    const result = await request(server).get(`/api/articles/${REAL_ARTICLE_ID}`);
    expect(result.statusCode).toBe(OK);
  });

  test(`Получение несуществующей публикаций`, async () => {
    const result = await request(server).get(`/api/articles/${FAKE_ARTICLE_ID}`);
    expect(result.statusCode).toBe(BAD_REQUEST);
  });

  test(`Создание новой публикации`, async () => {
    const result = await request(server).post(`/api/articles`).send(mockArticle);
    expect(result.statusCode).toBe(OK);
  });

  test(`Создание новой публикации без нужных данных`, async () => {
    const result = await request(server).post(`/api/articles`).send({});
    expect(result.statusCode).toBe(BAD_REQUEST);
  });

  test(`Обновление публикации`, async () => {
    const result = await request(server).put(`/api/articles/${REAL_ARTICLE_ID}`);
    expect(result.statusCode).toBe(OK);
  });

  test(`Обновление несуществующей публикации`, async () => {
    const result = await request(server).put(`/api/articles/${FAKE_ARTICLE_ID}`);
    expect(result.statusCode).toBe(BAD_REQUEST);
  });

  test(`Удаление публикации`, async () => {
    const result = await request(server).delete(`/api/articles/${REAL_ARTICLE_ID}`);
    expect(result.statusCode).toBe(OK);
  });

  test(`Удаление несуществующей публикации`, async () => {
    const result = await request(server).delete(`/api/articles/${FAKE_ARTICLE_ID}`);
    expect(result.statusCode).toBe(BAD_REQUEST);
  });

  test(`Получение списка комментариев к публикации`, async () => {
    const result = await request(server).get(`/api/articles/${REAL_ARTICLE_ID}/comments`);
    expect(result.statusCode).toBe(OK);
  });

  test(`Получение списка комментариев к несуществующей публикации`, async () => {
    const result = await request(server).get(`/api/articles/${FAKE_ARTICLE_ID}/comments`);
    expect(result.statusCode).toBe(BAD_REQUEST);
  });

  test(`Удаление комментария у публикации`, async () => {
    const result = await request(server).delete(`/api/articles/${REAL_ARTICLE_ID}/comments/${REAL_COMMENT_ID}`);
    expect(result.statusCode).toBe(OK);
  });

  test(`Удаление комментария у несуществующей публикации`, async () => {
    const result = await request(server).delete(`/api/articles/${FAKE_ARTICLE_ID}/comments/${REAL_COMMENT_ID}`);
    expect(result.statusCode).toBe(BAD_REQUEST);
  });

  test(`Удаление несуществующего комментария у публикации`, async () => {
    const result = await request(server).delete(`/api/articles/${REAL_ARTICLE_ID}/comments/${FAKE_COMMENT_ID}`);
    expect(result.statusCode).toBe(BAD_REQUEST);
  });

  test(`Создание нового комментария к публикации`, async () => {
    const result = await request(server).put(`/api/articles/${REAL_ARTICLE_ID}/comments`).send({id: 1, text: `text`});
    expect(result.statusCode).toBe(OK);
  });

  test(`Создание нового комментария к публикации без нужных данных`, async () => {
    const result = await request(server).put(`/api/articles/${REAL_ARTICLE_ID}/comments`).send({});
    expect(result.statusCode).toBe(BAD_REQUEST);
  });

  test(`Создание нового комментария к несуществующего публикации`, async () => {
    const result = await request(server).put(`/api/articles/${FAKE_ARTICLE_ID}/comments`).send({id: 1, text: `text`});
    expect(result.statusCode).toBe(BAD_REQUEST);
  });
});
