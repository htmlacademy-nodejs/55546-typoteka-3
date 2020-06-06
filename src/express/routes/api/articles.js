'use strict';

const router = require(`express`).Router;
const route = router();

const logger = require(`../../../logger`).getLogger();

const validateExistValue = (data, fields) =>
  fields.reduce((list, key) => [...list, ...(!data[key] ? [`Пустое поле: ${key} `] : [])], []);

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
  route.post(`/`, async (req, res) => {
    const data = req.body;
    const errors = validateExistValue(data, [`title`, `announce`, `full_text`]);
    if (errors.length > 0) {
      logger.info(`Не удалось создать новую публикацию:\n ${errors}`);
      res.json({response: `Не удалось создать новую публикацию:\n ${errors}`});
      return;
    }

    try {
      const article = await service.create(data);
      res.json(article.dataValues);
      logger.info(`Создана новая публикация`);
    } catch (err) {
      res.status(400).json({err});
      logger.error(`Ошибка при создании публикации: ${err}`);
    }
  });

  // PUT / api / articles /: articleId — редактирует определённую публикацию;
  route.put(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const data = req.body;
    const errors = validateExistValue(data, [`title`, `announce`, `full_text`]);
    if (errors.length > 0) {
      logger.info(`Не удалось обновить публикацию:\n ${errors}`);
      res.json({response: `Не удалось обновить публикацию:\n ${errors}`});
      return;
    }

    try {
      const article = await service.update(articleId, data);
      res.json(article.dataValues);
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
