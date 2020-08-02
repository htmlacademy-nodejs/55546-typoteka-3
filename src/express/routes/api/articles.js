'use strict';

const router = require(`express`).Router;
const route = router();

const logger = require(`../../../logger`).getLogger();
const validatorMiddleware = require(`../../middleware/validator-post`);

const articleSchemaValidator = require(`../../validators/article`);

module.exports = async (app, ClassService) => {
  logger.info(`Подключение articles api`);

  const service = new ClassService();

  app.use(`/api/articles`, route);

  // GET / api / articles — ресурс возвращает список публикаций;
  route.get(`/`, async (req, res) => {
    res.json(await service.findAll());
  });

  route.get(`/popular`, async (req, res) => {
    logger.info(`Запрос наиболее популярных статей`);
    res.json(await service.findPopular());
  });

  // GET / api / articles /: articleId — возвращает полную информацию о публикации;
  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    let article = {};
    try {
      article = await service.findOne(articleId);
    } catch (err) {
      res.sendStatus(404);
      logger.error(`Ошибка при получении статьи: ${articleId}`);
    }

    res.json(article);
  });

  route.get(`/page/:page`, async (req, res) => {
    res.json({
      articles: (await service.findAllByPage(req.params.page)),
      count: (await service.getCount())
    });
  });

  route.get(`/category/:categoryId/:page`, async (req, res) => {
    const {categoryId, page} = req.params;
    res.json({
      articles: (await service.findAllByCategory(categoryId, page)),
      count: (await service.getCountByCategory(categoryId))
    });
  });

  // GET / api / articles / user /: userId — возвращает список публикаций созданных указанным пользователем
  route.get(`/user/:userId`, async (req, res) => {
    res.json(await service.findAllByUser(req.params.userId));
  });

  // POST / api / articles — создаёт новую публикацию;
  route.post(`/`, validatorMiddleware(articleSchemaValidator, true), async (req, res) => {
    try {
      const article = await service.create(req.body);
      res.status(200).json(article.dataValues);
      logger.info(`Создана новая публикация`);
    } catch (err) {
      res.status(400).json({err});
      logger.error(`Ошибка при создании публикации: ${err}`);
    }
  });

  // PUT / api / articles /: articleId — редактирует определённую публикацию;
  route.put(`/:articleId`, validatorMiddleware(articleSchemaValidator, true), async (req, res) => {
    try {
      const article = await service.update(req.params.articleId, req.body);
      res.status(200).json(article.dataValues);
      logger.info(`Редактирование публикации завершено`);
    } catch (err) {
      res.status(400).json(`Ошибка при редактирование публикации: ${err}`);
      logger.error(`Ошибка при редактирование публикации: ${err}`);
    }
  });

  // DELETE / api / articles /: articleId — удаляет публикацию;
  route.delete(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    try {
      await service.delete(articleId);
      res.json({response: `Публикация ${articleId} удалена.`});
      logger.info(`Публикация ${articleId} удалена.`);
    } catch (err) {
      res.json({response: `Ошибка при удалении публикации: ${err}`});
      logger.info(`Ошибка при удалении публикации: ${err}`);
    }
  });
};
