'use strict';

const router = require(`express`).Router;
const route = router();

const logger = require(`../../logger`).getLogger();

route.get(`/category/:id`, (req, res) => {
  res.render(`publications-by-category`);
  logger.info(`Status code ${res.statusCode}`);
});

route.get(`/add`, (req, res) => {
  res.render(`admin-add-new-post-empty`);
  logger.info(`Status code ${res.statusCode}`);
});

route.get(`/edit/:id`, (req, res) => {
  res.render(`admin-add-new-post`);
  logger.info(`Status code ${res.statusCode}`);
});

route.get(`/:id`, (req, res) => {
  res.render(`post-user`);
  logger.info(`Status code ${res.statusCode}`);
});

module.exports = route;
