'use strict';

const axios = require(`axios`);
const router = require(`express`).Router;
const route = router();
const {getUrlRequest} = require(`../../utils`);

const logger = require(`../../logger`).getLogger();

route.get(`/category/:id`, (req, res) => {
  res.render(`publications-by-category`);
  logger.info(`Status code ${res.statusCode}`);
});

route.get(`/add`, async (req, res) => {
  res.render(`admin-add-new-post-empty`);
  logger.info(`Status code ${res.statusCode}`);
});

route.post(`/add`, async (req, res) => {
  console.log(`-------------------add---`, req.body);

  res.render(`admin-add-new-post-empty`);
  logger.info(`Status code ${res.statusCode}`);
});

route.get(`/edit/:id`, async (req, res) => {
  let article = null;

  try {
    article = (await axios.get(getUrlRequest(req, `/api/articles/${req.params.id}`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении статьи`);
    return;
  }

  res.render(`admin-add-new-post`, {article});
  logger.info(`Status code ${res.statusCode}`);
});

route.get(`/:id`, (req, res) => {
  res.render(`post-user`);
  logger.info(`Status code ${res.statusCode}`);
});

module.exports = route;
