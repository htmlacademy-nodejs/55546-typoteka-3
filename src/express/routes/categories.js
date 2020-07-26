'use strict';

const router = require(`express`).Router;
const {getUrlRequest} = require(`../../utils`);
const axios = require(`axios`);
const authenticate = require(`../middleware/authenticate`);
const logger = require(`../../logger`).getLogger();
const route = router();

route.get(`/`, authenticate, async (req, res) => {
  let categories = [];
  try {
    categories = (await axios.get(getUrlRequest(req, `/api/categories`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  res.render(`admin-categories`, {categories, errors: null});
});

route.post(`/`, authenticate, async (req, res) => {
  let categories = [];
  let errors = null;

  try {
    await axios.post(getUrlRequest(req, `/api/categories`), JSON.stringify(req.body),
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
    categories = (await axios.get(getUrlRequest(req, `/api/categories`))).data;
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
        await axios.put(getUrlRequest(req, `/api/categories/${id}`), JSON.stringify({title}),
            {headers: {'Content-Type': `application/json`}});
        logger.info(`Категория отредактирована`);
      } catch (err) {
        logger.error(`Ошибка при редактировании категорий (${id}): ${err}`);
      }
    } else if (action === `delete`) {
      try {
        await axios.delete(getUrlRequest(req, `/api/categories/${id}`));
        logger.info(`Категория удалена`);
      } catch (err) {
        logger.error(`Ошибка при удалении категорий (${id}): ${err}`);
      }
    }
  }

  res.redirect(`/categories`);
});

module.exports = route;
