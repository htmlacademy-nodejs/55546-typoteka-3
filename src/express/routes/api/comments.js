'use strict';

// const fs = require(`fs`).promises;
const router = require(`express`).Router;
const route = router();

const logger = require(`../../../logger`).getLogger();

// const getArticles = async () => JSON.parse((await fs.readFile(`mock.json`)).toString());

module.exports = async (app, ClassService) => {
  logger.info(`Подключение comments api`);

  const service = new ClassService();

  app.use(`/api/comments`, route);

  // GET / api / comments -
  route.get(`/last`, async (req, res) => {
    return res.json(await service.findLast());
  });

  // GET / api / comments -
  route.get(`/personal-last`, async (req, res) => {
    return res.json(await service.findLastByUser());
  });
};
