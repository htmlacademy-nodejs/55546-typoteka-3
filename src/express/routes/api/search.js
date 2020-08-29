'use strict';

const {HttpCode} = require(`../../../http-code`);
const {runAsyncWrapper, callbackErrorApi} = require(`../../../utils`);

const router = require(`express`).Router;
const logger = require(`../../../logger`).getLogger();

const route = router();

module.exports = async (app, service) => {
  logger.info(`Подключение search api`);

  app.use(`/api/search`, route);

  route.get(`/:title`, runAsyncWrapper(async (req, res) => {
    res.status(HttpCode.OK).json(await service.getSearch(req.params.title));
  }, callbackErrorApi(`Ошибка при поиске статей по заголовку`)));
};
