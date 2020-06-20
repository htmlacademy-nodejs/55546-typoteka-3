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

route.get(`/register`, (req, res) => {
  res.render(`registration`, {errors: null, data: {}});
});

route.post(`/register`, multer({storage: multerStorage}).single(`avatar`), async (req, res) => {
  const {file, body} = req;
  let errors = null;

  if (file) {
    body.avatar = file.filename;
  }

  try {
    await axios.post(getUrlRequest(req, `/api/user/`), JSON.stringify(body),
        {headers: {'Content-Type': `application/json`}});
    logger.info(`Регистрация прошла успешно`);
    res.redirect(`/user/login`);
  } catch (err) {
    if (err.response && err.response.data) {
      errors = err.response.data.message;
      logger.error(`Ошибка валидации: ${errors}`);
    }
    logger.error(`Ошибка при регистрации: ${err}`);
  }

  res.render(`registration`, {form: null, errors, data: body});
});

route.get(`/login`, (req, res) => {
  let errors = null;
  res.render(`registration`, {form: `login`, errors, data: {}});
});

route.post(`/login`, (req, res) => {
  let errors = null;
  res.render(`registration`, {form: `login`, errors, data: {}});
});

module.exports = route;

