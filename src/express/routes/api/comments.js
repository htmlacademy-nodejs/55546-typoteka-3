'use strict';

const router = require(`express`).Router;
const logger = require(`../../../logger`).getLogger();
const validatorMiddleware = require(`../../middleware/validator-post`);
const commentSchemaValidator = require(`../../validators/comment`);
const {HttpCode: {OK, CREATED}} = require(`../../../http-code`);
const {runAsyncWrapper, callbackErrorApi} = require(`../../../utils`);

const route = router();

module.exports = async (app, service) => {
  logger.info(`Подключение comments api`);

  app.use(`/api/comments`, route);

  route.get(`/all`, runAsyncWrapper(async (req, res) => {
    res.status(OK).json(await service.findAll());
  }, callbackErrorApi(`Ошибка при получении списка всех комментариев`)));

  route.get(`/last`, runAsyncWrapper(async (req, res) => {
    res.status(OK).json(await service.findLast());
  }, callbackErrorApi(`Ошибка при получении списка последних комментариев`)));

  route.post(`/:articleId`, validatorMiddleware(commentSchemaValidator), runAsyncWrapper(async (req, res) => {
    console.log(`CREATED COMMENT::1`);
    const createdComment = await service.create(req.body);
    console.log(`CREATED COMMENT::2`);
    console.log(createdComment);
    console.log(`id`, createdComment.id);
    res.status(CREATED).json(await service.findOne(createdComment.id));
  }, callbackErrorApi(`Ошибка при создании нового комментария`)));

  route.delete(`/:commentId`, runAsyncWrapper(async (req, res) => {
    res.status(OK).json(await service.delete(+req.params.commentId));
  }, callbackErrorApi(`Ошибка при удалении комментария`)));
};
