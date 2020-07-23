'use strict';

const router = require(`express`).Router;
const {getUrlRequest} = require(`../../utils`);
const axios = require(`axios`);
const logger = require(`../../logger`).getLogger();
const route = router();

route.get(`/`, async (req, res) => {
  let categories = [];
  try {
    categories = (await axios.get(getUrlRequest(req, `/api/categories`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  res.render(`admin-categories`, {categories, errors: null});
});

route.post(`/`, async (req, res) => {
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

module.exports = route;
