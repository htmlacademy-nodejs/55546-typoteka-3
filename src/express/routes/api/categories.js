'use strict';

const router = require(`express`).Router;
const logger = require(`../../../logger`).getLogger();
const validatorMiddleware = require(`../../middleware/validator-post`);
const categorySchemaValidator = require(`../../validators/category`);

const route = router();

module.exports = async (app, ClassService) => {
  logger.info(`Подключение categories api`);

  const service = new ClassService();

  app.use(`/api/categories`, route);

  // GET / api / categories — возвращает список категорий;
  route.get(`/`, async (req, res) => {
    res.json(await service.findAll());
  });

  route.post(`/`, validatorMiddleware(categorySchemaValidator), async (req, res) => {
    try {
      await service.create(req.body);
      logger.info(`Создана новая категория`);
    } catch (err) {
      res.status(400).json(`Ошибка при создании новой категории: ${err}`);
      return;
    }
    res.status(200).json({result: `Создана новая категория`});
  });

  route.get(`/:id`, async (req, res) => {
    const {id} = req.params;
    logger.info(`Получение категории: ${id}`);
    res.status(200).json(await service.findOne(id));
  });

  route.put(`/:id`, validatorMiddleware(categorySchemaValidator), async (req, res) => {
    await service.update(req.params.id, req.body);
    res.status(200).end();
  });

  route.delete(`/:id`, async (req, res) => {
    if (!(await service.checkIsAddedCategories(req.params.id))) {
      await service.delete(req.params.id);
      res.status(200).end();
      return;
    }

    res.status(400).json({message: `У категории уже есть привязанные статьи и её нельзя удалить.`});
  });

  route.post(`/set-article-categories`, async (req, res) => {
    logger.info(`Добавления списка категорий к публикации`);
    const {articleId, categories} = req.body;
    res.status(200).json(await service.setArticleCategory(articleId, categories));
  });
};
