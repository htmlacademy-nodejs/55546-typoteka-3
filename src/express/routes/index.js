'use strict';

const axios = require(`axios`);

const { getUrlRequest } = require(`../../utils`);
const router = require(`express`).Router;
const appRouter = router();

const logger = require(`../../logger`).getLogger();

appRouter.get(`/`, async (req, res) => {
  logger.info(`Главная страница`);

  let categories = [];
  try {
    categories = (await axios.get(getUrlRequest(req, `/api/categories`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
    return;
  }

  let articles = [];
  try {
    articles = (await axios.get(getUrlRequest(req, `/api/articles`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка статей`);
    return;
  }

  let pupularArticles = [];
  try {
    pupularArticles = (await axios.get(getUrlRequest(req, `/api/articles/popular`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка популярных статей`);
    return;
  }

  let lastComments = [];
  try {
    lastComments = (await axios.get(getUrlRequest(req, `/api/comments/last`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка последних комментариев`);
    return;
  }

  res.render(`main`, { articles, categories, pupularArticles, lastComments });
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
  logger.info(`Персональные публикации`);
  let articles = [];
  try {
    articles = (await axios.get(getUrlRequest(req, `/api/articles/user/1`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка статей пользователя`);
    return;
  }

  res.render(`personal-publications`, { articles });
});

appRouter.get(`/my/comments`, async (req, res) => {
  let comments = [];
  try {
    comments = (await axios.get(getUrlRequest(req, `/api/comments/personal-last`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка предложений`);
    return;
  }

  res.render(`personal-comments`, { comments });
});

appRouter.get(`/search`, async (req, res) => {
  const { title = `` } = req.query;
  let articles = [];
  if (title) {
    try {
      articles = (await axios.get(getUrlRequest(req, `/api/search?query=${title}`))).data;
      logger.info(`Поиск статьи с заголовком: ${title}`);
    } catch (err) {
      logger.error(`Ошибка при получении списка статей`);
    }
  }

  res.render(`search`, {
    articles,
    title,
    isEmpty: articles.length === 0
  });
});

module.exports = appRouter;
