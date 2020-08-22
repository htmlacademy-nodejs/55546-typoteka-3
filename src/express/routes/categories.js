'use strict';

const router = require(`express`).Router;
const authenticate = require(`../middleware/authenticate`);
const logger = require(`../../logger`).getLogger();

const route = router();

route.get(`/`, authenticate, async (req, res) => {
  let categories = [];
  try {
    categories = (await req.axios.get(`/api/categories`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  res.render(`admin-categories`, {categories, errors: null});
});

route.post(`/`, authenticate, async (req, res) => {
  let categories = [];
  let errors = null;

  try {
    await req.axios.post(`/api/categories`, JSON.stringify(req.body),
        {headers: {'Content-Type': `application/json`}});
    logger.info(`Создана новая категория`);
  } catch (err) {
    if (err.response && err.response.data) {
      errors = err.response.data.message;
      logger.error(`Ошибка валидации: ${errors}`);
    }
    logger.error(`Ошибка создании новой категории: ${err}`);
  }

  try {
    categories = (await req.axios.get(`/api/categories`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  res.render(`admin-categories`, {categories, errors});
});

route.post(`/action/:id`, authenticate, async (req, res) => {
  const {id} = req.params;
  const {title, action} = req.body;

  if (action) {
    if (action === `edit`) {
      try {
        await req.axios.put(`/api/categories/${id}`, JSON.stringify({title}),
            {headers: {'Content-Type': `application/json`}});
        logger.info(`Категория отредактирована`);
      } catch (err) {
        logger.error(`Ошибка при редактировании категорий (${id}): ${err}`);
      }
    } else if (action === `delete`) {
      try {
        await req.axios.delete(`/api/categories/${id}`);
        logger.info(`Категория удалена`);
      } catch (err) {
        logger.error(`Ошибка при удалении категорий (${id}): ${err}`);
      }
    }
  }

  res.redirect(`/categories`);
});

module.exports = route;
