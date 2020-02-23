'use strict';

const router = require(`express`).Router;
const appRouter = router();

appRouter.get(`/`, (req, res) => {
  res.render(`main`);
});

appRouter.get(`/register`, (req, res) => {
  res.render(`registration`);
});

appRouter.get(`/login`, (req, res) => {
  res.render(`registration`);
});

appRouter.get(`/my`, (req, res) => {
  res.render(`admin-publications`);
});

appRouter.get(`/my/comments`, (req, res) => {
  res.render(`admin-comments`);
});

appRouter.get(`/search`, (req, res) => {
  res.render(`search-1`);
});

module.exports = appRouter;
