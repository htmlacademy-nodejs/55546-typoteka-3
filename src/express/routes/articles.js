'use strict';

const moment = require(`moment`);
const path = require(`path`);
const axios = require(`axios`);
const router = require(`express`).Router;
const route = router();
const {getUrlRequest, pagination} = require(`../../utils`);
const logger = require(`../../logger`).getLogger();
const multer = require(`multer`);
const {PAGINATION_LIMIT, UPLOADED_PATH, ADMIN_ID} = require(`../../const`);
const authenticate = require(`../middleware/authenticate`);
const paramValidator = require(`../middleware/validator-params`);
const checkLogin = require(`../middleware/check-login`);
const {unlink} = require(`fs`).promises;

const ALLOW_FILE_EXT = [`.jpg`, `.png`];

const multerStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${UPLOADED_PATH}/articles/`);
  },
  filename(req, file, cb) {
    cb(null, `${+(Date.now())}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => cb(null, ALLOW_FILE_EXT.includes(path.extname(file.originalname)));

route.post(`/delete/:id`, async (req, res) => {
  // console.log(path.join(__dirname, ``));
  // try {
  //   await axios.delete(getUrlRequest(req, `/api/articles/${req.params.id}`));
  // } catch (err) {
  //   logger.error(`Ошибка при удалении статьи: ${err}`);
  // }

  try {
    // unlink(`p`);
  } catch (err) {
    logger.error(`Ошибка при удалении изображения статьи: ${err}`);
  }

  res.redirect(`/my`);
});

route.get(`/category/:categoryId`, paramValidator(`categoryId`, `number`), async (req, res) => {
  const {categoryId} = req.params;
  let currentCategory = null;
  try {
    currentCategory = (await axios.get(getUrlRequest(req, `/api/categories/${categoryId}`))).data;
  } catch (err) {
    logger.info(`Ошибка при получении категорий: ${categoryId}: ${err}`);
  }

  let categories = [];
  try {
    categories = (await axios.get(getUrlRequest(req, `/api/categories`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  const currentPage = +(req.query.page || 1);
  let articlesData = {articles: [], count: 0};
  try {
    articlesData = (await axios.get(getUrlRequest(req, `/api/articles/category/${categoryId}/${currentPage}`))).data;
  } catch (err) {
    logger.info(`Ошибка при получении публикаций: ${err}`);
  }

  res.render(`articles-by-category`, {
    currentCategory,
    categories,
    articles: articlesData.articles,
    pagination: pagination(articlesData.count, PAGINATION_LIMIT, currentPage)
  });
});

route.get(`/add`, authenticate, async (req, res) => {
  logger.info(`Создание новой статьи`);

  let categories = [];
  try {
    categories = (await axios.get(getUrlRequest(req, `/api/categories`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  res.render(`create-article`, {categories, article: {}, objectError: {}});
});

route.post(`/add`, authenticate, multer({storage: multerStorage, fileFilter}).single(`img`), async (req, res) => {
  const {body, file} = req;
  let errors = null;
  let objectError = {};

  if (file) {
    body.img = file.filename;
  }

  let categories = [];
  try {
    categories = (await axios.get(getUrlRequest(req, `/api/categories`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  try {
    const article = await axios.post(getUrlRequest(req, `/api/articles`), JSON.stringify({
      'title': body[`title`],
      'img': body[`img`],
      'announce': body[`announce`],
      'full_text': body[`full_text`],
      'date_create': !body[`date_create`] ? Date.now() : +(new Date(body[`date_create`].split(`.`).reverse().join(`-`))),
      'categories': body[`categories`],
      'author_id': ADMIN_ID,
    }), {headers: {'Content-Type': `application/json`}});

    await axios.post(getUrlRequest(req, `/api/categories/set-article-categories`),
        JSON.stringify({articleId: article.data.id, categories: body.categories}),
        {headers: {'Content-Type': `application/json`}}).data;

    logger.info(`Создано новое предложение ${article.data.id}`);
    res.redirect(`/my`);
    return;
  } catch (err) {
    if (err.response && err.response.data) {
      errors = err.response.data.message;
      objectError = err.response.data.object;
      logger.error(`Ошибка валидации: ${errors}`);
    }
    logger.error(`Ошибка при создании новой статьи: ${err}`);
  }

  res.render(`create-article`, {categories, article: body, errors, objectError});
});


route.get(`/:id`, paramValidator(`id`, `number`), async (req, res) => {
  let article = {};
  let errors = null;

  try {
    article = (await axios.get(getUrlRequest(req, `/api/articles/${req.params.id}`))).data;
    article[`date_create`] = moment(article[`date_create`]).format(`DD.MM.YYYY hh:mm`);
    article.comments.forEach((comment) => {
      comment[`date_create`] = moment(comment[`date_create`]).format(`DD.MM.YYYY hh:mm`);
    });
  } catch (err) {
    logger.error(`Ошибка при получении статьи: ${err}`);
  }

  res.render(`article`, {article, errors});
});

route.post(`/:id`, checkLogin, async (req, res) => {
  const {id} = req.params;
  let article = {};
  let errors = null;

  try {
    article = (await axios.get(getUrlRequest(req, `/api/articles/${req.params.id}`))).data;
    article[`date_create`] = moment(article[`date_create`]).format(`DD.MM.YYYY hh:mm`);
    article.comments.forEach((comment) => {
      comment[`date_create`] = moment(comment[`date_create`]).format(`DD.MM.YYYY hh:mm`);
    });
  } catch (err) {
    logger.error(`Ошибка при получении статьи: ${err}`);
  }

  try {
    await axios.post(getUrlRequest(req, `/api/comments/${id}`),
        JSON.stringify({
          [`author_id`]: +req.session[`user_id`],
          [`article_id`]: +id,
          [`date_create`]: new Date(),
          text: req.body.text,
        }),
        {headers: {'Content-Type': `application/json`}});
    logger.info(`Комментарий был успешно создан.`);
  } catch (err) {
    if (err.response && err.response.data) {
      errors = err.response.data.message;
      logger.error(`Ошибка валидации: ${errors}`);
    }
    logger.error(`Ошибка при создании комментария: ${err}`);
  }

  res.render(`article`, {article, errors});
});

route.get(`/edit/:id`, [authenticate, paramValidator(`id`, `number`)], async (req, res) => {
  let article = {};
  try {
    article = (await axios.get(getUrlRequest(req, `/api/articles/${req.params.id}`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении статьи`);
    return;
  }

  let categories = [];
  try {
    categories = (await axios.get(getUrlRequest(req, `/api/categories`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении предложения`);
  }

  res.render(`edit-article`, {article, categories, objectError: {}});
});

route.post(`/edit/:id`, [
  authenticate,
  paramValidator(`id`, `number`),
  multer({storage: multerStorage}).single(`img`)
], async (req, res) => {
  const {file, body, params} = req;
  let errors = null;
  let objectError = {};

  let article = {};
  try {
    article = (await axios.get(getUrlRequest(req, `/api/articles/${params.id}`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении публикации`);
  }

  if (file) {
    body.img = file.filename;
  }

  let categories = [];
  try {
    categories = (await axios.get(getUrlRequest(req, `/api/categories`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  try {
    body[`date_create`] = +(new Date(body[`date_create`].split(`.`).reverse().join(`-`)));
    body[`author_id`] = article[`author_id`];
    await axios.put(getUrlRequest(req, `/api/articles/${params.id}`), JSON.stringify(body),
        {headers: {'Content-Type': `application/json`}});

    await axios.post(getUrlRequest(req, `/api/categories/set-article-categories`),
        JSON.stringify({articleId: params.id, categories: body.categories}),
        {headers: {'Content-Type': `application/json`}}).data;

    logger.info(`Публикация была успешно отредактирована`);
    res.redirect(`/my`);
  } catch (err) {
    if (err.response && err.response.data) {
      errors = err.response.data.message;
      objectError = err.response.data.object;
      logger.error(`Ошибка валидации: ${errors}`);
    }
    logger.error(`Ошибка при редактировании публикации (${params.id}): ${err}`);
  }

  res.render(`edit-article`, {article, categories, errors, objectError});
});

module.exports = route;
