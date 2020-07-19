'use strict';

const path = require(`path`);
const axios = require(`axios`);
const router = require(`express`).Router;
const route = router();
const {getUrlRequest} = require(`../../utils`);
const logger = require(`../../logger`).getLogger();
const csrf = require(`csurf`);

const multer = require(`multer`);
const multerStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.join(__dirname, `../../tmp`));
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  }
});

const csrfMiddleware = csrf();

route.get(`/register`, csrfMiddleware, (req, res) => {
  res.render(`registration`, {
    errors: null,
    data: {},
    csrf: req.csrfToken()
  });
});

route.post(`/register`, [csrfMiddleware, multer({storage: multerStorage}).single(`avatar`)], async (req, res) => {
  const {file, body} = req;
  let errors = null;

  if (file) {
    body.avatar = file.filename;
  }

  try {
    await axios.post(getUrlRequest(req, `/api/user/`), JSON.stringify(body),
        {headers: {'Content-Type': `application/json`}});
    logger.info(`Регистрация прошла успешно`);
    res.redirect(`/login`);
  } catch (err) {
    if (err.response && err.response.data) {
      errors = err.response.data.message;
      logger.error(`Ошибка валидации: ${errors}`);
    }
    logger.error(`Ошибка при регистрации: ${err}`);
  }

  res.render(`registration`, {
    form: null,
    errors,
    data: body,
    csrf: req.csrfToken()
  });
});

route.get(`/login`, csrfMiddleware, (req, res) => {
  res.render(`registration`, {
    form: `login`,
    errors: null,
    data: {},
    csrf: req.csrfToken()
  });
});

route.post(`/login`, csrfMiddleware, async (req, res) => {
  const {body} = req;
  let errors = null;
  try {
    const user = await axios.post(getUrlRequest(req, `/api/user/login`), JSON.stringify(body),
        {headers: {'Content-Type': `application/json`}});

    req.session[`user_id`] = user.data.id;

    logger.info(`Авторизация прошла успешно`);
    res.redirect(`/`);
    return;
  } catch (err) {
    if (err.response && err.response.data) {
      errors = err.response.data.message;
      logger.error(`Ошибка валидации: ${errors}`);
    }
    logger.error(`Ошибка при авторизации: ${err}`);
  }

  res.render(`registration`, {
    form: `login`,
    errors,
    data: body,
    csrf: req.csrfToken()
  });
});

route.get(`/logout`, (req, res) => {
  delete req.session[`user_id`];
  res.redirect(`/login`);
});

module.exports = route;

