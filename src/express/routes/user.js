'use strict';

const router = require(`express`).Router;
const {createMulterStorage} = require(`../../utils`);
const logger = require(`../../logger`).getLogger();
const csrf = require(`csurf`);
const {unlink} = require(`fs`).promises;
const multer = require(`multer`);
const authenticate = require(`../middleware/authenticate`);
const {UPLOADED_PATH} = require(`../../const`);

const route = router();
const multerStorage = multer.diskStorage(createMulterStorage(`${UPLOADED_PATH}/users/`));

const csrfMiddleware = csrf();

route.post(`/comment-delete/:id`, authenticate, async (req, res) => {
  try {
    await req.axios.delete(`/api/comments/${req.params.id}`);
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

route.post(`/register`, [multer({storage: multerStorage}).single(`avatar`), csrfMiddleware], async (req, res) => {
  const {file, body} = req;
  let errors = null;

  if (file) {
    body.avatar = file.filename;
  }

  try {
    await req.axios.post(`/api/user/`, JSON.stringify(body),
        {headers: {'Content-Type': `application/json`}});
    logger.info(`Регистрация прошла успешно`);
    res.redirect(`/login`);
    return;
  } catch (err) {
    if (body.avatar) {
      try {
        await unlink(`${UPLOADED_PATH}/users/${body.avatar}`);
      } catch (fileError) {
        logger.info(`Ошибка при очистке файла с аватаром пользователя: ${fileError}`);
      }
    }

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
    const user = await req.axios.post(`/api/user/login`, JSON.stringify(body),
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

