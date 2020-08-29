'use strict';

const router = require(`express`).Router;
const logger = require(`../../../logger`).getLogger();
const validatorMiddleware = require(`../../middleware/validator-post`);
const articleSchemaValidator = require(`../../validators/article`);
const {HttpCode: {OK, NOT_FOUND, CREATED}} = require(`../../../http-code`);
const {runAsyncWrapper, callbackErrorApi} = require(`../../../utils`);

const route = router();

module.exports = async (app, service) => {
  logger.info(`Подключение articles api`);

  app.use(`/api/articles`, route);

  route.get(`/`, runAsyncWrapper(async (req, res) => {
    res.status(OK).json(await service.findAll());
  }, callbackErrorApi(`Ошибка при получении списка всех статей`)));

  route.get(`/popular`, runAsyncWrapper(async (req, res) => {
    res.status(OK).json(await service.findPopular());
  }, callbackErrorApi(`Ошибка при получении списка популярных статей`)));

  route.get(`/:articleId`, runAsyncWrapper(async (req, res) => {
    res.status(OK).json(await service.findOne(req.params.articleId));
  }, callbackErrorApi(`Ошибка при получении конкретной статьи`, NOT_FOUND)));

  route.get(`/page/:page`, runAsyncWrapper(async (req, res) => {
    res.status(OK).json({
      articles: (await service.findAllByPage(req.params.page)),
      count: (await service.getCount())
    });
  }, callbackErrorApi(`Ошибка при получении статей для страницы`, NOT_FOUND)));

  route.get(`/category/:categoryId/:page`, runAsyncWrapper(async (req, res) => {
    const {categoryId, page} = req.params;
    res.status(OK).json({
      articles: (await service.findAllByCategory(categoryId, page)),
      count: (await service.getCountByCategory(categoryId))
    });
  }, callbackErrorApi(`Ошибка при получении статей для страницы в категории`, NOT_FOUND)));

  route.post(`/`, validatorMiddleware(articleSchemaValidator), runAsyncWrapper(async (req, res) => {
    res.status(CREATED).json((await service.create(req.body)).dataValues);
  }, callbackErrorApi(`Ошибка при создании статьи`)));

  route.put(`/:articleId`, validatorMiddleware(articleSchemaValidator), runAsyncWrapper(async (req, res) => {
    res.status(OK).json((await service.update(req.params.articleId, req.body)).dataValues);
  }, callbackErrorApi(`Ошибка при редактирование статьи`)));

  route.delete(`/:articleId`, runAsyncWrapper(async (req, res) => {
    await service.delete(req.params.articleId);
    res.sendStatus(OK);
  }, callbackErrorApi(`Ошибка при удалении статьи`)));
};
