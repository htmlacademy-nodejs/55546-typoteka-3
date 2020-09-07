'use strict';

const moment = require(`moment`);
const router = require(`express`).Router;
const {
  createPagination,
  createMulterStorage,
  deleteImage,
  getValidateErrorInfo,
} = require(`../../utils`);
const logger = require(`../../logger`).getLogger();
const multer = require(`multer`);
const authenticate = require(`../middleware/authenticate`);
const {PAGINATION_LIMIT, UPLOADED_PATH, ADMIN_ID} = require(`../../const`);
const {SocketEvent} = require(`../../socket-event`);

const ARTICLE_UPLOADED_PATH = `${UPLOADED_PATH}/articles`;
const FIRST_PAGE = 1;
const DEFAULT_ARTICLES_COUNT = 0;
const CORRECT_DATE_FORMAT = `HH:mm:ss`;

const route = router();
const multerStorage = multer.diskStorage(createMulterStorage(ARTICLE_UPLOADED_PATH));

const getCorrectDate = (date) => date ? new Date(`${date.split(`.`).reverse().join(`.`)} ${moment().format(CORRECT_DATE_FORMAT)}`) : new Date();

route.post(`/delete/:id`, authenticate, async (req, res) => {
  const article = await req.requestHelper.getArticleById(req.params.id, `/my`);

  try {
    await req.axios.delete(`/api/articles/${req.params.id}`);
    deleteImage(`${ARTICLE_UPLOADED_PATH}/${article.img}`);
  } catch (err) {
    logger.error(`Ошибка при удалении статьи: ${err}`);
  }

  res.redirect(`/my`);
});

route.get(`/category/:categoryId`, async (req, res) => {
  const {categoryId} = req.params;
  const currentPage = +(req.query.page || FIRST_PAGE);
  let data = {articles: [], count: DEFAULT_ARTICLES_COUNT};

  try {
    data = (await req.axios.get(`/api/articles/category/${categoryId}/${currentPage}`)).data;
  } catch (err) {
    logger.error(`Ошибка при получении публикаций: ${err}`);
  }

  res.render(`articles-by-category`, {
    currentCategory: await req.axios.get(`/api/categories/${categoryId}`)
      .then((result) => result.data)
      .catch((error) => {
        logger.error(`Ошибка при получении категорий: ${categoryId}: ${error}`);
        return null;
      }),
    categories: await req.requestHelper.getAllCategories(true),
    articles: data.articles,
    pagination: createPagination(data.count, PAGINATION_LIMIT, currentPage)
  });
});

route.get(`/add`, authenticate, async (req, res) => {
  res.render(`create-article`, {
    categories: await req.requestHelper.getAllCategories(),
    article: {
      dateCreate: new Date()
    },
    objectError: {}
  });
});

route.post(`/add`, authenticate, multer({storage: multerStorage}).single(`img`), async (req, res) => {
  const {body, file} = req;
  let errorsData = {errors: null, objectError: {}};

  if (file) {
    body.img = file.filename;
  }

  try {
    const article = await req.axios.post(`/api/articles`, {
      title: body.title,
      img: body.img,
      announce: body.announce,
      fullText: body.fullText,
      dateCreate: getCorrectDate(body.dateCreate),
      categories: body.categories,
      authorId: ADMIN_ID,
    });
    await req.axios.post(`/api/categories/set-article-categories`,
        {articleId: article.data.id, categories: body.categories}).data;
    res.redirect(`/my`);
    return;
  } catch (err) {
    deleteImage(`${ARTICLE_UPLOADED_PATH}/${body.img}`);
    errorsData = getValidateErrorInfo(err);
    logger.error(`Ошибка при создании новой статьи: ${err}`);
  }

  res.render(`create-article`, {
    categories: await req.requestHelper.getAllCategories(),
    article: body,
    ...errorsData
  });
});

route.get(`/:id`, async (req, res) => {
  res.render(`article`, {
    article: await req.requestHelper.getArticleById(req.params.id, `/client-error`),
    errors: null,
    refLink: req.headers.referer
  });
});

route.post(`/:id`, async (req, res) => {
  const {id} = req.params;
  let errorsData = {errors: null, objectError: {}};

  try {
    const createdComment = await req.axios.post(`/api/comments/${id}`, {
      authorId: +req.session.userId,
      articleId: +id,
      dateCreate: new Date(),
      text: req.body.text,
    });

    req.app.get(`socketObject`)
      .distribution(SocketEvent.UPDATE_COMMENTS, createdComment.data)
      .distribution(SocketEvent.UPDATE_ARTICLES, await req.requestHelper.getPopularArticles());

    res.redirect(`/articles/${id}`);
    return;
  } catch (err) {
    errorsData = getValidateErrorInfo(err);
    logger.error(`Ошибка при создании комментария: ${err}`);
  }

  res.render(`article`, {
    article: await req.requestHelper.getArticleById(req.params.id, `/client-error`),
    refLink: req.headers.referer,
    ...errorsData
  });
});

route.get(`/edit/:id`, authenticate, async (req, res) => {
  res.render(`edit-article`, {
    article: await req.requestHelper.getArticleById(req.params.id, `/client-error`),
    categories: await req.requestHelper.getAllCategories(),
    objectError: {}
  });
});

route.post(`/edit/:id`, [
  authenticate,
  multer({storage: multerStorage}).single(`img`)
], async (req, res) => {
  const {file, body, params} = req;
  let errorsData = {errors: null, objectError: {}};

  if (file) {
    body.img = file.filename;
  }

  try {
    body.dateCreate = getCorrectDate(body.dateCreate);
    body.authorId = ADMIN_ID;
    await req.axios.put(`/api/articles/${params.id}`, body);
    await req.axios.post(`/api/categories/set-article-categories`,
        {articleId: params.id, categories: body.categories}).data;
    res.redirect(`/my`);
    return;
  } catch (err) {
    deleteImage(`${ARTICLE_UPLOADED_PATH}/${body.img}`);
    errorsData = getValidateErrorInfo(err);
    logger.error(`Ошибка при редактировании статьи (${params.id}): ${err}`);
  }

  res.render(`edit-article`, {
    article: await req.requestHelper.getArticleById(req.params.id, `/client-error`),
    categories: await req.requestHelper.getAllCategories(),
    ...errorsData
  });
});

module.exports = route;
