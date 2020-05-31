'use strict';

const path = require(`path`);
const axios = require(`axios`);
const router = require(`express`).Router;
const route = router();
const { getUrlRequest } = require(`../../utils`);

const logger = require(`../../logger`).getLogger();

const multer = require(`multer`);
const multerStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, `../../tmp`));
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

route.get(`/category/:id`, async (req, res) => {
  res.render(`publications-by-category`);
  logger.info(`Status code ${res.statusCode}`);
});

route.get(`/add`, async (req, res) => {
  logger.info(`Создание новой статьи`);

  let categories = [];
  try {
    categories = (await axios.get(getUrlRequest(req, `/api/categories`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении списка категорий`);
  }

  res.render(`create-article`, { categories, article: {} });
});

route.get(`/:id`, async (req, res) => {
  let article = {};
  try {
    article = (await axios.get(getUrlRequest(req, `/api/articles/${req.params.id}`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении статьи: ${err}`);
  }

  console.log(article.categories);

  res.render(`article`, { article });
});

route.post(`/add`, multer({ storage: multerStorage }).single(`img`), async (req, res) => {
  const { body, file } = req;

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
      'author_id': 1,
      'title': body[`title`],
      'img': body[`img`],
      'announce': body[`announce`],
      'full_text': body[`full_text`],
    }), { headers: { 'Content-Type': `application/json` } });

    // await axios.post(getUrlRequest(req, `/api/categories/set-article-categories`),
    //     JSON.stringify({articleId: article.data.id, categories: body.categories}),
    //     { headers: { 'Content-Type': `application/json` } }).data;

    logger.info(`Создано новое предложение ${article.data.id}`);

    res.redirect(`/my`);
  } catch (err) {
    logger.error(`Ошибка при создании новой статьи: ${err}`);
  }

  res.render(`create-article`, { categories, article: body });

  // try {
  //   const offer = await axios.post(getUrlRequest(req, `/api/offers`), JSON.stringify({ ...body, author_id: 1 }),
  //     { headers: { 'Content-Type': `application/json` } });

  //   await axios.post(getUrlRequest(req, `/api/categories/set-offer-categories`),
  //     JSON.stringify({ offerId: offer.data.id, categories: body.categories }),
  //     { headers: { 'Content-Type': `application/json` } }).data;

  //   logger.info(`Создано новое предложение ${offer.data.id}`);
  //   res.redirect(`/my`);
  // } catch (err) {
  //   logger.error(`Ошибка при создании нового объявления: ${err}`);
  // }

  // res.render(`offer-create`, { categories, offer: body });
});

route.get(`/edit/:id`, async (req, res) => {
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

  res.render(`edit-article`, { article, categories });
});

route.post(`/edit/:id`, multer({ storage: multerStorage }).single(`img`), async (req, res) => {
  const { file, body, params } = req;
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
    await axios.put(getUrlRequest(req, `/api/articles/${params.id}`), JSON.stringify(body),
      { headers: { 'Content-Type': `application/json` } });

    //   await axios.post(getUrlRequest(req, `/api/categories/set-offer-categories`),
    //     JSON.stringify({ offerId: params.id, categories: body.categories }),
    //     { headers: { 'Content-Type': `application/json` } }).data;

    logger.info(`Публикация была успешно отредактирована`);
    res.redirect(`/my`);
  } catch (err) {
    logger.error(`Ошибка при редактировании публикации (${params.id}): ${err}`);
  }

  let article = {};
  try {
    article = (await axios.get(getUrlRequest(req, `/api/articles/${params.id}`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении публикации`);
  }
  res.render(`edit-article`, { article, categories });
});

module.exports = route;
