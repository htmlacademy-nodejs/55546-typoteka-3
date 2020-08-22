'use strict';

const router = require(`express`).Router;
const {createPagination, createMulterStorage, getCorrectDateFormat, setCorrectDate} = require(`../../utils`);
const logger = require(`../../logger`).getLogger();
const multer = require(`multer`);
const authenticate = require(`../middleware/authenticate`);
const {unlink} = require(`fs`).promises;
const {PAGINATION_LIMIT, UPLOADED_PATH, ADMIN_ID} = require(`../../const`);

const FIRST_PAGE = 1;
const DEFAULT_ARTICLES_COUNT = 0;
const MIN_ARTICLE_COMMENT_COUNT = 0;

const route = router();
const multerStorage = multer.diskStorage(createMulterStorage(`${UPLOADED_PATH}/articles/`));

const getCorrectDate = (date) => date ? new Date(date.split(`.`).reverse().join(`.`)) : new Date();

route.post(`/delete/:id`, authenticate, async (req, res) => {
  let articleImg = null;
  try {
    const article = (await req.axios.get(`/api/articles/${req.params.id}`)).data;
    articleImg = article.img;
  } catch (err) {
    logger.error(`Ошибка при получении статьи: ${err}`);
    res.redirect(`/my`);
    return;
  }

  try {
    await req.axios.delete(`/api/articles/${req.params.id}`);
  } catch (err) {
    logger.error(`Ошибка при удалении статьи: ${err}`);
  }

  if (articleImg) {
    try {
      await unlink(`${UPLOADED_PATH}/articles/${articleImg}`);
    } catch (err) {
      logger.error(`Ошибка при удалении изображения статьи: ${err}`);
    }
  }

  res.redirect(`/my`);
});

route.get(`/category/:categoryId`, async (req, res) => {
  const {categoryId} = req.params;
  let currentCategory = null;
  try {
    currentCategory = (await req.axios.get(`/api/categories/${categoryId}`)).data;
  } catch (err) {
    logger.info(`Ошибка при получении категорий: ${categoryId}: ${err}`);
  }

  let categories = [];
  try {
    categories = (await req.axios.get(`/api/categories`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  const currentPage = +(req.query.page || FIRST_PAGE);
  let data = {articles: [], count: DEFAULT_ARTICLES_COUNT};
  try {
    data = (await req.axios.get(`/api/articles/category/${categoryId}/${currentPage}`)).data;
  } catch (err) {
    logger.info(`Ошибка при получении публикаций: ${err}`);
  }

  res.render(`articles-by-category`, {
    currentCategory,
    categories,
    articles: data.articles,
    pagination: createPagination(data.count, PAGINATION_LIMIT, currentPage)
  });
});

route.get(`/add`, authenticate, async (req, res) => {
  logger.info(`Создание новой статьи`);

  let categories = [];
  try {
    categories = (await req.axios.get(`/api/categories`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  res.render(`create-article`, {categories, article: {}, objectError: {}});
});

route.post(`/add`, authenticate, multer({storage: multerStorage}).single(`img`), async (req, res) => {
  const {body, file} = req;
  let errors = null;
  let objectError = {};

  if (file) {
    body.img = file.filename;
  }

  let categories = [];
  try {
    categories = (await req.axios.get(`/api/categories`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  try {
    const article = await req.axios.post(`/api/articles`, JSON.stringify({
      'title': body[`title`],
      'img': body[`img`],
      'announce': body[`announce`],
      'full_text': body[`full_text`],
      'date_create': getCorrectDate(body[`date_create`]),
      'categories': body[`categories`],
      'author_id': ADMIN_ID,
    }), {headers: {'Content-Type': `application/json`}});

    await req.axios.post(`/api/categories/set-article-categories`,
        JSON.stringify({articleId: article.data.id, categories: body.categories}),
        {headers: {'Content-Type': `application/json`}}).data;

    logger.info(`Создана новая статья ${article.data.id}`);
    res.redirect(`/my`);
    return;
  } catch (err) {
    if (body.img) {
      try {
        await unlink(`${UPLOADED_PATH}/articles/${body.img}`);
      } catch (fileErr) {
        logger.info(`Файл к статье не был удалён: ${fileErr}`);
      }
    }

    if (err.response && err.response.data) {
      errors = err.response.data.message;
      objectError = err.response.data.object;
      logger.error(`Ошибка валидации: ${errors}`);
    }
    logger.error(`Ошибка при создании новой статьи: ${err}`);
  }

  res.render(`create-article`, {categories, article: body, errors, objectError});
});

route.get(`/:id`, async (req, res) => {
  let article = {};
  try {
    article = (await req.axios.get(`/api/articles/${req.params.id}`)).data;
    article[`date_create`] = getCorrectDateFormat(article[`date_create`]);
    article.comments = setCorrectDate(article.comments);
  } catch (err) {
    logger.error(`Ошибка при получении статьи: ${err}`);
    res.redirect(`/client-error`);
    return;
  }

  res.render(`article`, {article, errors: null, refLink: req.headers.referer});
});

route.post(`/:id`, async (req, res) => {
  const {id} = req.params;
  let article = {};
  let errors = null;

  try {
    article = (await req.axios.get(`/api/articles/${req.params.id}`)).data;
    article[`date_create`] = getCorrectDateFormat(article[`date_create`]);
    article.comments = setCorrectDate(article.comments);
  } catch (err) {
    logger.error(`Ошибка при получении статьи: ${err}`);
    res.redirect(`/client-error`);
    return;
  }

  try {
    const createdComment = await req.axios.post(`/api/comments/${id}`,
        JSON.stringify({
          [`author_id`]: +req.session[`user_id`],
          [`article_id`]: +id,
          [`date_create`]: new Date(),
          text: req.body.text,
        }), {headers: {'Content-Type': `application/json`}});
    logger.info(`Комментарий был успешно создан.`);

    req.socket.clients.forEach((client) => client.emit(`update-comments`, createdComment.data));

    let popularArticles = (await req.axios.get(`/api/articles/popular`)).data;
    popularArticles = popularArticles.filter((it) => it.commentsCount > MIN_ARTICLE_COMMENT_COUNT);

    logger.info(`Список популярных статей был обновлён.`, popularArticles);

    req.socket.clients.forEach((client) => client.emit(`update-articles`, popularArticles));

    res.redirect(`/articles/${id}`);
    return;
  } catch (err) {
    if (err.response && err.response.data) {
      errors = err.response.data.message;
      logger.error(`Ошибка валидации: ${errors}`);
    }
    logger.error(`Ошибка при создании комментария: ${err}`);
  }

  res.render(`article`, {article, errors, refLink: req.headers.referer});
});

route.get(`/edit/:id`, authenticate, async (req, res) => {
  let article = {};
  try {
    article = (await req.axios.get(`/api/articles/${req.params.id}`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении статьи`);
    res.redirect(`/client-error`);
    return;
  }

  let categories = [];
  try {
    categories = (await req.axios.get(`/api/categories`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении предложения`);
  }

  res.render(`edit-article`, {article, categories, objectError: {}});
});

route.post(`/edit/:id`, [
  authenticate,
  multer({storage: multerStorage}).single(`img`)
], async (req, res) => {
  const {file, body, params} = req;
  let errors = null;
  let objectError = {};

  let article = {};
  try {
    article = (await req.axios.get(`/api/articles/${params.id}`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении статьи`);
    res.redirect(`/client-error`);
    return;
  }

  if (file) {
    body.img = file.filename;
  }

  let categories = [];
  try {
    categories = (await req.axios.get(`/api/categories`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  try {
    body[`date_create`] = getCorrectDateFormat(body[`date_create`]);
    body[`author_id`] = article[`author_id`];
    await req.axios.put(`/api/articles/${params.id}`, JSON.stringify(body),
        {headers: {'Content-Type': `application/json`}});

    await req.axios.post(`/api/categories/set-article-categories`,
        JSON.stringify({articleId: params.id, categories: body.categories}),
        {headers: {'Content-Type': `application/json`}}).data;

    logger.info(`Публикация была успешно отредактирована`);
    res.redirect(`/my`);
    return;
  } catch (err) {
    if (body.img) {
      try {
        await unlink(`${UPLOADED_PATH}/articles/${body.img}`);
      } catch (fileErr) {
        logger.info(`Файл к статье не был удалён: ${fileErr}`);
      }
    }

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
