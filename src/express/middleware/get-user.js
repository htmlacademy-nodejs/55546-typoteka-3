'use strict';

const logger = require(`../../logger`).getLogger();

module.exports = async (req, res, next) => {
  const id = req.session.userId;
  if (id) {
    try {
      res.locals.user = (await req.axios.get(`/api/user/get/${id}`)).data;
    } catch (err) {
      logger.error(`Ошибка при получении пользователя по id - (${id}): ${err}`);
    }
  }

  next();
};
