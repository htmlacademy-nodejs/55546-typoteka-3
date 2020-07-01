'use strict';

const axios = require(`axios`);
const {getUrlRequest} = require(`../../utils`);
const logger = require(`../../logger`).getLogger();

module.exports = async (req, res, next) => {
  const id = req.session[`user_id`];
  if (id) {
    try {
      const user = await axios.get(getUrlRequest(req, `/api/user/get/${id}`),
          {headers: {'Content-Type': `application/json`}});

      res.locals.user = user.data;
      logger.info(`Пользователь с id (${id}) был успешно найден`);
    } catch (err) {
      logger.error(`Ошибка при получении пользователя по id - (${id}): ${err}`);
    }
  }

  next();
};
