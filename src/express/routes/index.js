'use strict';

const axios = require(`axios`);

const {getUrlRequest} = require(`../../utils`);
const router = require(`express`).Router;
const appRouter = router();

const logger = require(`../../logger`).getLogger();

appRouter.get(`/`, async (req, res) => {
  let articles = [];

  try {
    articles = (await axios.get(getUrlRequest(req, `/api/articles`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка статей`);
    return;
  }

  res.render(`main`, {articles});
  logger.info(`Status code ${res.statusCode}`);
});

appRouter.get(`/register`, (req, res) => {
  res.render(`registration`);
  logger.info(`Status code ${res.statusCode}`);
});

appRouter.get(`/login`, (req, res) => {
  res.render(`registration`);
  logger.info(`Status code ${res.statusCode}`);
});

appRouter.get(`/my`, async (req, res) => {
  let articles = [];

  try {
    articles = (await axios.get(getUrlRequest(req, `/api/articles`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка статей`);
    return;
  }

  res.render(`admin-publications`, {articles});
  logger.info(`Status code ${res.statusCode}`);
});

appRouter.get(`/my/comments`, async (req, res) => {
  let articles = [];

  try {
    articles = (await axios.get(getUrlRequest(req, `/api/articles`))).data.splice(0, 3);
  } catch (err) {
    logger.error(`Ошибка при получении списка предложений`);
    return;
  }

  res.render(`admin-comments`, {
    comments: articles.reduce((arr, article) => [...arr, ...article.comments], [])
  });
  logger.info(`Status code ${res.statusCode}`);
});

appRouter.get(`/search`, async (req, res) => {
  const {title = ``} = req.query;
  let articles = [];
  let isEmpty = false;

  if (title) {
    try {
      articles = (await axios.get(getUrlRequest(req, `/api/search?query=${title}`))).data;
    } catch (err) {
      logger.error(`Ошибка при получении списка предложений`);
      return;
    }
    isEmpty = articles.length === 0;
  }

  res.render(`search-1`, {articles, title, isEmpty});
  logger.info(`Status code ${res.statusCode}`);
});

module.exports = appRouter;
