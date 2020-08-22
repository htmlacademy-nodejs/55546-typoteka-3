'use strict';

const router = require(`express`).Router;
const logger = require(`../../../logger`).getLogger();

const route = router();

module.exports = async (app, service) => {
  logger.info(`Подключение search api`);

  app.use(`/api/search`, route);

  route.get(`/`, async (req, res) => {
    const {query} = req.query;
    logger.info(`Получение списка статей по заголовку ${query}`);
    res.status(200).json(await service.getSearch(query));
  });
};
