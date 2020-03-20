'use strict';

const fs = require(`fs`).promises;
const router = require(`express`).Router;
const route = router();

const getArticles = async () => JSON.parse((await fs.readFile(`mock.json`)).toString());

// GET / api / articles — ресурс возвращает список публикаций;
route.get(`/`, async (req, res) => {
  res.json(await getArticles());
});

// GET / api / articles /: articleId — возвращает полную информацию о публикации;
route.get(`/:articleId`, async (req, res) => {
  const article = (await getArticles()).find((it) => it.id === req.params.articleId);
  if (!article) {
    res.sendStatus(400);
  }

  res.json(article);
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
      console.log(`error key ${key}`);
      res.sendStatus(400);
    }
  }

  res.json({response: `New article!`, data: req.body});
});

// PUT / api / articles /: articleId — редактирует определённую публикацию;
route.put(`/:articleId`, async (req, res) => {
  const article = (await getArticles()).find((it) => it.id === req.params.articleId);
  if (!article) {
    res.sendStatus(400);
  }

  res.json({response: `Edit article by id: ${article.id}!`});
});

// DELETE / api / articles /: articleId — удаляет определённое публикацию;
route.delete(`/:articleId`, async (req, res) => {
  const article = (await getArticles()).find((it) => it.id === req.params.articleId);
  if (!article) {
    res.sendStatus(400);
  }

  res.json({response: `Delete offer by id: ${article.id}!`});
});

// GET / api / articles /: articleId / comments — возвращает список комментариев определённой публикации;
route.get(`/:articleId/comments`, async (req, res) => {
  const article = (await getArticles()).find((it) => it.id === req.params.articleId);
  if (!article) {
    res.sendStatus(400);
  }

  res.json(article.comments);
});

// DELETE / api / articles /: articleId / comments /: commentId — удаляет из определённой публикации комментарий с идентификатором;
route.delete(`/:articleId/comments/:commentId`, async (req, res) => {
  const {articleId, commentId} = req.params;

  const article = (await getArticles()).find((it) => it.id === articleId);
  if (!article) {
    res.sendStatus(400);
  }

  const comment = article.comments.find((it) => it.id === commentId);
  if (!comment) {
    res.sendStatus(400);
  }

  res.json({
    response: `Delete comment by id ${comment.id}!`
  });
});

// PUT / api / articles /: articleId / comments — создаёт новый комментарий;
route.put(`/:articleId/comments`, async (req, res) => {
  const {id, text} = req.body;
  if (!id || !text) {
    res.sendStatus(400);
  }

  res.json({response: `Create comment!`, data: req.body});
});

module.exports = route;
