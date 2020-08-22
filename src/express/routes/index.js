'use strict';

const {createPagination, setCorrectDate} = require(`../../utils`);
const express = require(`express`);
const logger = require(`../../logger`).getLogger();
const authenticate = require(`../middleware/authenticate`);
const {PAGINATION_LIMIT} = require(`../../const`);

const FIRST_PAGE = 1;
const DEFAULT_ARTICLES_COUNT = 0;
const MIN_ARTICLE_COMMENT_COUNT = 0;

const router = express.Router;
const appRouter = router();

appRouter.get(`/`, async (req, res) => {
  logger.info(`Главная страница`);

  let categories = [];
  try {
    categories = (await req.axios.get(`/api/categories`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  let popularArticles = [];
  try {
    popularArticles = (await req.axios.get(`/api/articles/popular`)).data;
    popularArticles = popularArticles.filter((article) => article.commentsCount > MIN_ARTICLE_COMMENT_COUNT);
  } catch (err) {
    logger.error(`Ошибка при получении списка популярных статей`);
  }

  let lastComments = [];
  try {
    lastComments = (await req.axios.get(`/api/comments/last`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка последних комментариев`);
  }

  const currentPage = +(req.query.page || FIRST_PAGE);
  let data = {articles: [], count: DEFAULT_ARTICLES_COUNT};
  try {
    data = (await req.axios.get(`/api/articles/page/${currentPage}`)).data;
  } catch (err) {
    logger.info(`Ошибка при получении публикаций: ${err}`);
  }

  res.render(`main`, {
    categories,
    articles: setCorrectDate(data.articles),
    popularArticles,
    lastComments,
    pagination: createPagination(data.count, PAGINATION_LIMIT, currentPage)
  });
});

appRouter.get(`/my`, authenticate, async (req, res) => {
  logger.info(`Персональные публикации`);
  let articles = [];
  try {
    articles = (await req.axios.get(`/api/articles`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка статей пользователя`);
    return;
  }

  res.render(`personal-publications`, {
    articles: setCorrectDate(articles),
  });
});

appRouter.get(`/my/comments`, authenticate, async (req, res) => {
  let comments = [];
  try {
    comments = (await req.axios.get(`/api/comments/all`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка предложений`);
    return;
  }

  res.render(`personal-comments`, {
    comments: setCorrectDate(comments)
  });
});

appRouter.get(`/search`, async (req, res) => {
  const {title = ``} = req.query;
  let articles = [];
  if (title) {
    try {
      articles = (await req.axios.get(`/api/search?query=${title}`)).data;
      logger.info(`Поиск статьи с заголовком: ${title}`);
    } catch (err) {
      logger.error(`Ошибка при получении списка статей`);
    }
  }

  res.render(`search`, {
    articles: setCorrectDate(articles),
    title,
    isEmpty: articles.length === 0
  });
});

appRouter.get(`/client-error`, (req, res) => {
  res.render(`errors/404`);
});

appRouter.get(`/server-error`, (req, res) => {
  res.render(`errors/500`);
});

module.exports = appRouter;
