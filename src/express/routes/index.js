'use strict';

const router = require(`express`).Router;
const appRouter = router();

const logger = require(`../../logger`).getLogger();

appRouter.get(`/`, (req, res) => {
  res.render(`main`);
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

appRouter.get(`/my`, (req, res) => {
  res.render(`admin-publications`);
  logger.info(`Status code ${res.statusCode}`);
});

appRouter.get(`/my/comments`, (req, res) => {
  res.render(`admin-comments`);
  logger.info(`Status code ${res.statusCode}`);
});

appRouter.get(`/search`, (req, res) => {
  res.render(`search-1`);
  logger.info(`Status code ${res.statusCode}`);
});

module.exports = appRouter;
