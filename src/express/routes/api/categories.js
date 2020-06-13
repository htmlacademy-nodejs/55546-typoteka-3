'use strict';

const router = require(`express`).Router;
const route = router();

const logger = require(`../../../logger`).getLogger();
const paramValidator = require(`../../middleware/validator-params`);

module.exports = async (app, ClassService) => {
  logger.info(`Подключение categories api`);

  const service = new ClassService();

  app.use(`/api/categories`, route);

  // GET / api / categories — возвращает список категорий;
  route.get(`/`, async (req, res) => {
    res.json(await service.findAll());
  });

  route.get(`/:id`, paramValidator(`id`, `number`), async (req, res) => {
    const {id} = req.params;
    logger.info(`Получение категории: ${id}`);
    res.status(200).json(await service.findOne(id));
  });

  route.post(`/set-article-categories`, async (req, res) => {
    logger.info(`Добавления списка категорий к публикации`);
    const {articleId, categories} = req.body;
    res.status(200).json(await service.setArticleCategory(articleId, categories));
  });
};
