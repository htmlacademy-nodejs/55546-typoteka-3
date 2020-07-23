'use strict';

// const fs = require(`fs`).promises;
const router = require(`express`).Router;
const route = router();

const logger = require(`../../../logger`).getLogger();

const validatorMiddleware = require(`../../middleware/validator-post`);
const paramValidator = require(`../../middleware/validator-params`);

const commentSchemaValidator = require(`../../validators/comment`);

module.exports = async (app, ClassService) => {
  logger.info(`Подключение comments api`);

  const service = new ClassService();

  app.use(`/api/comments`, route);

  // GET / api / comments / check-is-author / :commentId / :userId - проверка, является ли пользователь автором комментария
  route.get(`/check-is-author/:commentId/:userId`, async (req, res) => {
    const {commentId, userId} = req.params;
    return res.status(200).json(await service.checkIsAuthor(commentId, userId));
  });

  // GET / api / comments / all - возвращает список всех комментариев
  route.get(`/all`, async (req, res) => {
    return res.status(200).json(await service.findAll());
  });

  // GET / api / comments / last - возвращает список последних комментариев на сайте
  route.get(`/last`, async (req, res) => {
    return res.status(200).json(await service.findLast());
  });

  // GET / api / comments / personal-last - возвращает список персональных комментариев пользователя
  route.get(`/personal-last`, async (req, res) => {
    return res.status(200).json(await service.findLastByUser());
  });

  // GET / api / comments /: articleId / all — возвращает список комментариев конкретного предложения
  route.get(`/:articleId/all`, paramValidator(`articleId`, `number`), async (req, res) => {
    return res.status(200).json(await service.findAllByArticleId(+req.params.articleId));
  });

  // GET / api / comments /: commentId — возвращает комментарий по id
  route.get(`/:commentId`, paramValidator(`commentId`, `number`), async (req, res) => {
    return res.status(200).json(await service.findOne(+req.params.commentId));
  });

  // POST / api / comments /: articleId — создаёт новый комментарий
  route.post(`/:articleId`, validatorMiddleware(commentSchemaValidator), async (req, res) => {
    return res.status(200).json(await service.create(req.body));
  });

  // PUT / api / comments /: commentId — обновляет указанный комментарий
  route.put(`/:commentId`, [
    paramValidator(`commentId`, `number`),
    validatorMiddleware(commentSchemaValidator)
  ], async (req, res) => {
    res.status(200).json(await service.update(+req.params.commentId, req.body));
  });

  // DELETE / api / comments /: commentId — удаляет указанный комментарий
  route.delete(`/:commentId`, paramValidator(`commentId`, `number`), async (req, res) => {
    return res.status(200).json(await service.delete(+req.params.commentId));
  });
};
