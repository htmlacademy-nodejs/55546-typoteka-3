'use strict';

const router = require(`express`).Router;
const logger = require(`../../../logger`).getLogger();
const validatorMiddleware = require(`../../middleware/validator-post`);
const commentSchemaValidator = require(`../../validators/comment`);

const route = router();

module.exports = async (app, ClassService) => {
  logger.info(`Подключение comments api`);

  const service = new ClassService();

  app.use(`/api/comments`, route);

  // GET / api / comments / all - возвращает список всех комментариев
  route.get(`/all`, async (req, res) => {
    return res.status(200).json(await service.findAll());
  });

  // GET / api / comments / last - возвращает список последних комментариев на сайте
  route.get(`/last`, async (req, res) => {
    return res.status(200).json(await service.findLast());
  });

  // POST / api / comments /: articleId — создаёт новый комментарий
  route.post(`/:articleId`, validatorMiddleware(commentSchemaValidator), async (req, res) => {
    const result = await service.create(req.body);
    return res.status(200).json(await service.findOne(result.id));
  });

  // DELETE / api / comments /: commentId — удаляет указанный комментарий
  route.delete(`/:commentId`, async (req, res) => {
    return res.status(200).json(await service.delete(+req.params.commentId));
  });
};
