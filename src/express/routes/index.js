'use strict';

const {Router: router} = require(`express`);

const appRouter = router();

appRouter.get(`/`, (req, res) => {
  res.send(`/`);
});

appRouter.get(`/register`, (req, res) => {
  res.send(`/register`);
});

appRouter.get(`/login`, (req, res) => {
  res.send(`/login`);
});

appRouter.get(`/my`, (req, res) => {
  res.send(`/my`);
});

appRouter.get(`/my/comments`, (req, res) => {
  res.send(`/my/comments`);
});

appRouter.get(`/offers/category/:id`, (req, res) => {
  res.send(`/offers/category/:id`);
});

appRouter.get(`/offers/add`, (req, res) => {
  res.send(`/offers/add`);
});

appRouter.get(`/search`, (req, res) => {
  res.send(`/search`);
});

appRouter.get(`/offers/edit/:id`, (req, res) => {
  res.send(`/offers/edit/:id`);
});

appRouter.get(`/offers/:id`, (req, res) => {
  res.send(`/offers/:id`);
});

module.exports = appRouter;
