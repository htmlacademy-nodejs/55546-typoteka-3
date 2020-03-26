'use strict';

const fs = require(`fs`).promises;
const server = require(`../../index`);
const request = require(`supertest`);

describe(`Проверка REST API для работы со списком публикаций`, () => {
  const FAKE_ARTICLE_ID = `9Gc4QREIT1EiNQQuGD3YU2`;
  const FAKE_COMMENT_ID = `9Gc4QREIT1EiNQQuGD3YU2`;

  let mockArticle = null;
  let REAL_ARTICLE_ID = null;
  let REAL_COMMENT_ID = null;


  // GET / api / search ? query = — возвращает результаты поиска.Поиск публикаций выполняется по заголовку.Публикация соответствует поиску в случае наличия хотя бы одного вхождения искомой фразы.

  beforeAll(async () => {
    mockArticle = JSON.parse((await fs.readFile(`mock.json`)).toString())[0];
    REAL_ARTICLE_ID = mockArticle.id;
    REAL_COMMENT_ID = mockArticle.comments[0].id;
  });

  test(`Получение всех публикаций`, async () => {
    const res = await request(server).get(`/api/articles`);
    expect(res.statusCode).toBe(200);
  });

  test(`Получение конкретной публикации по ID`, async () => {
    const res = await request(server).get(`/api/articles/${REAL_ARTICLE_ID}`);
    expect(res.statusCode).toBe(200);
  });

  test(`Получение несуществующей публикаций`, async () => {
    const res = await request(server).get(`/api/articles/${FAKE_ARTICLE_ID}`);
    expect(res.statusCode).toBe(400);
  });

  test(`Создание новой публикации`, async () => {
    const res = await request(server).post(`/api/articles`).send(mockArticle);
    expect(res.statusCode).toBe(200);
  });

  test(`Создание новой публикации без нужных данных`, async () => {
    const res = await request(server).post(`/api/articles`).send({});
    expect(res.statusCode).toBe(400);
  });

  test(`Обновление публикации`, async () => {
    const res = await request(server).put(`/api/articles/${REAL_ARTICLE_ID}`);
    expect(res.statusCode).toBe(200);
  });

  test(`Обновление несуществующей публикации`, async () => {
    const res = await request(server).put(`/api/articles/${FAKE_ARTICLE_ID}`);
    expect(res.statusCode).toBe(400);
  });

  test(`Удаление публикации`, async () => {
    const res = await request(server).delete(`/api/articles/${REAL_ARTICLE_ID}`);
    expect(res.statusCode).toBe(200);
  });

  test(`Удаление несуществующей публикации`, async () => {
    const res = await request(server).delete(`/api/articles/${FAKE_ARTICLE_ID}`);
    expect(res.statusCode).toBe(400);
  });

  test(`Получение списка комментариев к публикации`, async () => {
    const res = await request(server).get(`/api/articles/${REAL_ARTICLE_ID}/comments`);
    expect(res.statusCode).toBe(200);
  });

  test(`Получение списка комментариев к несуществующей публикации`, async () => {
    const res = await request(server).get(`/api/articles/${FAKE_ARTICLE_ID}/comments`);
    expect(res.statusCode).toBe(400);
  });

  test(`Удаление комментария у публикации`, async () => {
    const res = await request(server).delete(`/api/articles/${REAL_ARTICLE_ID}/comments/${REAL_COMMENT_ID}`);
    expect(res.statusCode).toBe(200);
  });

  test(`Удаление комментария у несуществующей публикации`, async () => {
    const res = await request(server).delete(`/api/articles/${FAKE_ARTICLE_ID}/comments/${REAL_COMMENT_ID}`);
    expect(res.statusCode).toBe(400);
  });

  test(`Удаление несуществующего комментария у публикации`, async () => {
    const res = await request(server).delete(`/api/articles/${REAL_ARTICLE_ID}/comments/${FAKE_COMMENT_ID}`);
    expect(res.statusCode).toBe(400);
  });

  test(`Создание нового комментария к публикации`, async () => {
    const res = await request(server).put(`/api/articles/${REAL_ARTICLE_ID}/comments`).send({id: 1, text: `text`});
    expect(res.statusCode).toBe(200);
  });

  test(`Создание нового комментария к публикации без нужных данных`, async () => {
    const res = await request(server).put(`/api/articles/${REAL_ARTICLE_ID}/comments`).send({});
    expect(res.statusCode).toBe(400);
  });

  test(`Создание нового комментария к несуществующего публикации`, async () => {
    const res = await request(server).put(`/api/articles/${FAKE_ARTICLE_ID}/comments`).send({id: 1, text: `text`});
    expect(res.statusCode).toBe(400);
  });
});
