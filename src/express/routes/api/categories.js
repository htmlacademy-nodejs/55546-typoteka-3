'use strict';

const router = require(`express`).Router;
const logger = require(`../../../logger`).getLogger();
const validatorMiddleware = require(`../../middleware/validator-post`);
const categorySchemaValidator = require(`../../validators/category`);
const {HttpCode: {OK, BAD_REQUEST, CREATED, NOT_FOUND}} = require(`../../../http-code`);
const {runAsyncWrapper, callbackErrorApi} = require(`../../../utils`);

const route = router();

module.exports = async (app, service) => {
  logger.info(`Подключение categories api`);

  app.use(`/api/categories`, route);

  route.get(`/`, runAsyncWrapper(async (req, res) => {
    res.status(OK).json(await service.findAll());
  }, callbackErrorApi(`Ошибка при получении списка всех категорий`)));

  route.post(`/`, validatorMiddleware(categorySchemaValidator), runAsyncWrapper(async (req, res) => {
    await service.create(req.body);
    res.sendStatus(CREATED);
  }, callbackErrorApi(`Ошибка при создании новой категории`)));

  route.get(`/:id`, runAsyncWrapper(async (req, res) => {
    res.status(OK).json(await service.findOne(req.params.id));
  }, callbackErrorApi(`Ошибка при получении категории`, NOT_FOUND)));

  route.put(`/:id`, validatorMiddleware(categorySchemaValidator), runAsyncWrapper(async (req, res) => {
    await service.update(req.params.id, req.body);
    res.sendStatus(OK);
  }, callbackErrorApi(`Ошибка при обновлении категории`)));

  route.delete(`/:id`, runAsyncWrapper(async (req, res) => {
    if (!(await service.getIsAddedCategories(req.params.id))) {
      await service.delete(req.params.id);
      res.sendStatus(OK);
    }
    res.sendStatus(BAD_REQUEST);
  }, callbackErrorApi(`Ошибка при удалении категории`)));

  route.post(`/set-article-categories`, runAsyncWrapper(async (req, res) => {
    const {articleId, categories} = req.body;
    res.status(CREATED).json(await service.setArticleCategory(articleId, categories));
  }, callbackErrorApi(`Ошибка при добавлении списка категорий к публикации`)));
};
