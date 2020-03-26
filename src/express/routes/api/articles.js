'use strict';

const fs = require(`fs`).promises;
const router = require(`express`).Router;
const route = router();

const logger = require(`../../../logger`).getLogger();

const getArticles = async () => JSON.parse((await fs.readFile(`mock.json`)).toString());

// GET / api / articles — ресурс возвращает список публикаций;
route.get(`/`, async (req, res) => {
  res.json(await getArticles());
  logger.info(`Status code ${res.statusCode}`);
});

// GET / api / articles /: articleId — возвращает полную информацию о публикации;
route.get(`/:articleId`, async (req, res) => {
  const article = (await getArticles()).find((it) => it.id === req.params.articleId);
  if (!article) {
    res.sendStatus(400);
    logger.error(`Публикация с указанным ID не найдена`);
  }

  res.json(article);
  logger.info(`Status code ${res.statusCode}`);
});

// POST / api / articles — создаёт новую публикацию;
route.post(`/`, async (req, res) => {
  const keys = [
    `id`,
    `title`,
    `announce`,
    `fullText`,
    `createdDate`,
    `category`,
    `comments`,
  ];

  for (const key of keys) {
    if (!req.body[key]) {
      res.sendStatus(400);
      logger.error(`Не хватает ${key} данных для создания новой публикации`);
      return;
    }
  }

  res.json({response: `New article!`, data: req.body});
  logger.info(`Status code ${res.statusCode}`);
});

// PUT / api / articles /: articleId — редактирует определённую публикацию;
route.put(`/:articleId`, async (req, res) => {
  const article = (await getArticles()).find((it) => it.id === req.params.articleId);
  if (!article) {
    res.sendStatus(400);
    logger.error(`Публикация с указанным ID не найдена`);
    return;
  }

  res.json({response: `Edit article by id: ${article.id}!`});
  logger.info(`Status code ${res.statusCode}`);
});

// DELETE / api / articles /: articleId — удаляет определённое публикацию;
route.delete(`/:articleId`, async (req, res) => {
  const article = (await getArticles()).find((it) => it.id === req.params.articleId);
  if (!article) {
    res.sendStatus(400);
    logger.error(`Публикация с указанным ID не найдена`);
    return;
  }

  res.json({response: `Delete offer by id: ${article.id}!`});
  logger.info(`Status code ${res.statusCode}`);
});

// GET / api / articles /: articleId / comments — возвращает список комментариев определённой публикации;
route.get(`/:articleId/comments`, async (req, res) => {
  const article = (await getArticles()).find((it) => it.id === req.params.articleId);
  if (!article) {
    res.sendStatus(400);
    logger.error(`Публикация с указанным ID не найдена`);
    return;
  }

  res.json(article.comments);
  logger.info(`Status code ${res.statusCode}`);
});

// DELETE / api / articles /: articleId / comments /: commentId — удаляет из определённой публикации комментарий с идентификатором;
route.delete(`/:articleId/comments/:commentId`, async (req, res) => {
  const {articleId, commentId} = req.params;

  const article = (await getArticles()).find((it) => it.id === articleId);
  if (!article) {
    res.sendStatus(400);
    logger.error(`Публикация с указанным ID не найдена`);
    return;
  }

  const comment = article.comments.find((it) => it.id === commentId);
  if (!comment) {
    res.sendStatus(400);
    logger.error(`Комментарий с указанным ID не найден`);
    return;
  }

  res.json({
    response: `Delete comment by id ${comment.id}!`
  });
  logger.info(`Status code ${res.statusCode}`);
});

// PUT / api / articles /: articleId / comments — создаёт новый комментарий;
route.put(`/:articleId/comments`, async (req, res) => {
  const {id, text} = req.body;

  const article = (await getArticles()).find((it) => it.id === req.params.articleId);
  if (!article) {
    res.sendStatus(400);
    logger.error(`Публикация с указанным ID не найдена`);
    return;
  }

  if (!id || !text) {
    res.sendStatus(400);
    logger.error(`Не хватает данных для создания комментария`);
    return;
  }

  res.json({response: `Create comment!`, data: req.body});
  logger.info(`Status code ${res.statusCode}`);
});

module.exports = route;
