'use strict';

const path = require(`path`);
const axios = require(`axios`);
const router = require(`express`).Router;
const route = router();
const {getUrlRequest} = require(`../../utils`);
const logger = require(`../../logger`).getLogger();
const csrf = require(`csurf`);

const multer = require(`multer`);
const authenticate = require(`../middleware/authenticate`);
const {UPLOADED_PATH} = require(`../../const`);

const ALLOW_FILE_EXT = [`.jpg`, `.png`];

const multerStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `${UPLOADED_PATH}/users/`);
  },
  filename(req, file, cb) {
    cb(null, `${+(Date.now())}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => cb(null, ALLOW_FILE_EXT.includes(path.extname(file.originalname)));


const csrfMiddleware = csrf();

route.post(`/comment-delete/:id`, authenticate, async (req, res) => {
  try {
    await axios.delete(getUrlRequest(req, `/api/comments/${req.params.id}`));
    logger.info(`Комментарий был удалён.`);
  } catch (err) {
    logger.error(`Ошибка при удалении комментария: ${err}`);
  }

  res.redirect(`/my/comments`);
});

route.get(`/register`, csrfMiddleware, (req, res) => {
  res.render(`registration`, {
    errors: null,
    data: {},
    csrf: req.csrfToken()
  });
});

route.post(`/register`, [multer({storage: multerStorage, fileFilter}).single(`avatar`), csrfMiddleware], async (req, res) => {
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
    errors,
    data: body,
    csrf: req.csrfToken()
  });
});

route.get(`/login`, csrfMiddleware, (req, res) => {
  res.render(`login`, {
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

  res.render(`login`, {
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

