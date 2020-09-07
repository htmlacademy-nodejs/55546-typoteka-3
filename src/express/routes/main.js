'use strict';

const {createPagination} = require(`../../utils`);
const express = require(`express`);
const logger = require(`../../logger`).getLogger();
const authenticate = require(`../middleware/authenticate`);
const {PAGINATION_LIMIT} = require(`../../const`);

const FIRST_PAGE = 1;
const DEFAULT_ARTICLES_COUNT = 0;

const router = express.Router;
const appRouter = router();

appRouter.get(`/`, async (req, res) => {
  const currentPage = +(req.query.page || FIRST_PAGE);
  let data = {articles: [], count: DEFAULT_ARTICLES_COUNT};

  try {
    data = (await req.axios.get(`/api/articles/page/${currentPage}`)).data;
  } catch (error) {
    logger.error(`Ошибка при получении публикаций: ${error}`);
  }

  res.render(`main`, {
    categories: await req.requestHelper.getAllCategories(true),
    articles: data.articles,
    popularArticles: await req.requestHelper.getPopularArticles(),
    lastComments: await req.axios.get(`/api/comments/last`)
      .then((result) => result.data)
      .catch((error) => {
        logger.error(`Ошибка при получении публикаций: ${error}`);
        return [];
      }),
    pagination: createPagination(data.count, PAGINATION_LIMIT, currentPage)
  });
});

appRouter.get(`/my`, authenticate, async (req, res) => {
  let articles = [];
  try {
    articles = (await req.axios.get(`/api/articles`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка статей пользователя`);
  }

  res.render(`personal-publications`, {articles});
});

appRouter.get(`/my/comments`, authenticate, async (req, res) => {
  let comments = [];
  try {
    comments = (await req.axios.get(`/api/comments/all`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка предложений`);
  }

  res.render(`personal-comments`, {comments});
});

appRouter.get(`/search`, async (req, res) => {
  const {title = ``} = req.query;
  let articles = !title ? [] : await req.axios.get(`/api/search/${encodeURIComponent(title)}`)
    .then((result) => result.data)
    .catch((error) => {
      logger.error(`Ошибка при получении списка статей: ${error}`);
      return [];
    });

  res.render(`search`, {
    articles,
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
