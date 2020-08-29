'use strict';

const router = require(`express`).Router;
const {createMulterStorage, deleteImage, getValidateErrorInfo} = require(`../../utils`);
const logger = require(`../../logger`).getLogger();
const csrf = require(`csurf`);
const multer = require(`multer`);
const authenticate = require(`../middleware/authenticate`);
const {UPLOADED_PATH} = require(`../../const`);

const USER_UPLOADED_PATH = `${UPLOADED_PATH}/users`;

const route = router();
const multerStorage = multer.diskStorage(createMulterStorage(USER_UPLOADED_PATH));

const csrfMiddleware = csrf();

route.post(`/comment-delete/:id`, authenticate, async (req, res) => {
  try {
    await req.axios.delete(`/api/comments/${req.params.id}`);
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
  let errorsData = {errors: null, objectError: {}};
  if (file) {
    body.avatar = file.filename;
  }

  try {
    await req.axios.post(`/api/user/`, body);
    res.redirect(`/login`);
    return;
  } catch (err) {
    deleteImage(`${USER_UPLOADED_PATH}/${body.avatar}`);
    errorsData = getValidateErrorInfo(err);
    logger.error(`Ошибка при регистрации: ${err}`);
  }

  res.render(`registration`, {
    data: body,
    csrf: req.csrfToken(),
    ...errorsData
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
  let errorsData = {errors: null, objectError: {}};
  try {
    req.session.userId = (await req.axios.post(`/api/user/login`, body)).data.id;
    res.redirect(`/`);
    return;
  } catch (err) {
    errorsData = getValidateErrorInfo(err);
    logger.error(`Ошибка при авторизации: ${err}`);
  }

  res.render(`login`, {
    data: body,
    csrf: req.csrfToken(),
    ...errorsData
  });
});

route.get(`/logout`, (req, res) => {
  delete req.session.userId;
  res.redirect(`/login`);
});

module.exports = route;
