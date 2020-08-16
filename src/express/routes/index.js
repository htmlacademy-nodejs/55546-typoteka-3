'use strict';

const moment = require(`moment`);
const axios = require(`axios`);
const {getUrlRequest, pagination} = require(`../../utils`);
const express = require(`express`);
const logger = require(`../../logger`).getLogger();
const authenticate = require(`../middleware/authenticate`);
const {PAGINATION_LIMIT} = require(`../../const`);

const router = express.Router;
const appRouter = router();

appRouter.get(`/`, async (req, res) => {
  logger.info(`Главная страница`);

  let categories = [];
  try {
    categories = (await axios.get(getUrlRequest(req, `/api/categories`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  let popularArticles = [];
  try {
    popularArticles = (await axios.get(getUrlRequest(req, `/api/articles/popular`))).data;
    popularArticles = popularArticles.filter((article) => article.commentsCount > 0);
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
    articles: articlesData.articles.map((article) => {
      article[`date_create`] = moment(article[`date_create`]).format(`DD.MM.YYYY hh:mm`);
      return article;
    }),
    popularArticles,
    lastComments,
    pagination: pagination(articlesData.count, PAGINATION_LIMIT, currentPage)
  });
});

appRouter.get(`/my`, authenticate, async (req, res) => {
  logger.info(`Персональные публикации`);
  let articles = [];
  try {
    articles = (await axios.get(getUrlRequest(req, `/api/articles`))).data;
    articles.forEach((article) => {
      article[`date_create`] = moment(article[`date_create`]).format(`DD.MM.YYYY hh:mm`);
    });
  } catch (err) {
    logger.error(`Ошибка при получении списка статей пользователя`);
    return;
  }

  res.render(`personal-publications`, {articles});
});

appRouter.get(`/my/comments`, authenticate, async (req, res) => {
  let comments = [];
  try {
    comments = (await axios.get(getUrlRequest(req, `/api/comments/all`))).data;
    comments.forEach((comment) => {
      comment[`date_create`] = moment(comment[`date_create`]).format(`DD.MM.YYYY hh:mm`);
    });
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
      articles.forEach((article) => {
        article[`date_create`] = moment(article[`date_create`]).format(`DD.MM.YYYY hh:mm`);
      });
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

appRouter.get(`/client-error`, (req, res) => {
  res.render(`errors/404`);
});

appRouter.get(`/server-error`, (req, res) => {
  res.render(`errors/500`);
});

module.exports = appRouter;
