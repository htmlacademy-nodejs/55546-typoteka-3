'use strict';

const axios = require(`axios`);

const {getUrlRequest, pagination} = require(`../../utils`);
const router = require(`express`).Router;
const appRouter = router();

const logger = require(`../../logger`).getLogger();

const {PAGINATION_LIMIT} = require(`../../const`);
const authenticate = require(`../middleware/authenticate`);

appRouter.get(`/`, async (req, res) => {
  logger.info(`Главная страница`);

  let categories = [];
  try {
    categories = (await axios.get(getUrlRequest(req, `/api/categories`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  let pupularArticles = [];
  try {
    pupularArticles = (await axios.get(getUrlRequest(req, `/api/articles/popular`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка популярных статей`);
  }

  let lastComments = [];
  try {
    lastComments = (await axios.get(getUrlRequest(req, `/api/comments/last`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка последних комментариев`);
  }

  const currentPage = +(req.query.page || 1);
  let articlesData = {articles: [], count: 0};
  try {
    articlesData = (await axios.get(getUrlRequest(req, `/api/articles/page/${currentPage}`))).data;
  } catch (err) {
    logger.info(`Ошибка при получении публикаций: ${err}`);
  }

  res.render(`main`, {
    categories,
    articles: articlesData.articles,
    pupularArticles,
    lastComments,
    pagination: pagination(articlesData.count, PAGINATION_LIMIT, currentPage)
  });
});

appRouter.get(`/my`, authenticate, async (req, res) => {
  logger.info(`Персональные публикации`);
  let articles = [];
  try {
    articles = (await axios.get(getUrlRequest(req, `/api/articles/user/${res.locals.user.id}`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка статей пользователя`);
    return;
  }

  res.render(`personal-publications`, {articles});
});

appRouter.get(`/my/comments`, authenticate, async (req, res) => {
  let comments = [];
  try {
    comments = (await axios.get(getUrlRequest(req, `/api/comments/personal-last`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка предложений`);
    return;
  }

  res.render(`personal-comments`, {comments});
});

appRouter.get(`/search`, async (req, res) => {
  const {title = ``} = req.query;
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
