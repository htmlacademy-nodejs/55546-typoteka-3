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

appRouter.get(`/offers/category/:id`, (req, res) => {
  res.render(`publications-by-category`);
});

appRouter.get(`/offers/add`, (req, res) => {
  res.render(`admin-add-new-post-empty`);
});

appRouter.get(`/search`, (req, res) => {
  res.render(`search-1`);
});

appRouter.get(`/offers/edit/:id`, (req, res) => {
  res.render(`admin-add-new-post`);
});

appRouter.get(`/offers/:id`, (req, res) => {
  res.render(`post-user`);
});

module.exports = appRouter;
