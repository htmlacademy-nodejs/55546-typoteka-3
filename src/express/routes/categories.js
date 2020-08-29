'use strict';

const router = require(`express`).Router;
const authenticate = require(`../middleware/authenticate`);
const {getValidateErrorInfo} = require(`../../utils`);
const logger = require(`../../logger`).getLogger();

const route = router();

route.get(`/`, authenticate, async (req, res) => {
  res.render(`admin-categories`, {
    categories: await req.requestHelper.getAllCategories(),
    errors: null
  });
});

route.post(`/`, authenticate, async (req, res) => {
  let errorsData = {errors: null, objectError: {}};
  try {
    await req.axios.post(`/api/categories`, req.body);
  } catch (err) {
    errorsData = getValidateErrorInfo(err);
    logger.error(`Ошибка создании новой категории: ${err}`);
  }

  res.render(`admin-categories`, {categories: await req.requestHelper.getAllCategories(), ...errorsData});
});

route.post(`/action/:id`, authenticate, async (req, res) => {
  const {id} = req.params;
  const {title, action} = req.body;

  if (action) {
    try {
      if (action === `edit`) {
        await req.axios.put(`/api/categories/${id}`, {title});
      } else if (action === `delete`) {
        await req.axios.delete(`/api/categories/${id}`);
      }
    } catch (err) {
      logger.error(`Ошибка при совершении с действия - ${action} категорией - ${id} : ${err}`);
    }
  }

  res.redirect(`/categories`);
});

module.exports = route;
