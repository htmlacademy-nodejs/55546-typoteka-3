'use strict';

const path = require(`path`);
const axios = require(`axios`);
const router = require(`express`).Router;
const route = router();
const {getUrlRequest} = require(`../../utils`);

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

route.get(`/category/:id`, (req, res) => {
  res.render(`publications-by-category`);
  logger.info(`Status code ${res.statusCode}`);
});

route.get(`/add`, async (req, res) => {
  res.render(`create-new-article`, {article: {}});
  logger.info(`Status code ${res.statusCode}`);
});

route.post(`/add`, multer({storage: multerStorage}).single(`img`), async (req, res) => {
  const article = req.body;

  try {
    await axios.post(getUrlRequest(req, `/api/articles`), JSON.stringify(article), {
      headers: {
        'Content-Type': `application/json`
      }
    });

    res.redirect(`/`);
    logger.info(`Status code ${res.statusCode}`);
    return;
  } catch (err) {
    logger.error(`Ошибка при создании новой статьи`);
    console.log(err);
  }

  res.render(`create-new-article`, {article});
  logger.info(`Status code ${res.statusCode}`);
});

route.get(`/edit/:id`, async (req, res) => {
  let article = null;

  try {
    article = (await axios.get(getUrlRequest(req, `/api/articles/${req.params.id}`))).data;
  } catch (err) {
    logger.error(`Ошибка при получении статьи`);
    return;
  }

  res.render(`edit-article`, {article});
  logger.info(`Status code ${res.statusCode}`);
});

route.post(`/edit/:id`, multer({storage: multerStorage}).single(`img`), async (req, res) => {
  const article = req.body;

  try {
    await axios.put(getUrlRequest(req, `/api/articles/${req.params.id}`), JSON.stringify(article), {
      headers: {
        'Content-Type': `application/json`
      }
    });

    res.redirect(`/`);
    logger.info(`Редактирование статьи прошло успешно: code ${res.statusCode}`);
    return;
  } catch (err) {
    logger.error(`Ошибка при редактировании статьи: ${req.params.id}`);
    console.log(err);
  }

  res.render(`create-new-article`, {article});
  logger.info(`Status code ${res.statusCode}`);
});

route.get(`/:id`, (req, res) => {
  res.render(`post-user`);
  logger.info(`Status code ${res.statusCode}`);
});

module.exports = route;
