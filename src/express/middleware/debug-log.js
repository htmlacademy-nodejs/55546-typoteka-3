'use strict';

const logger = require(`../../logger`).getLogger();

module.exports = (req, res, next) => {
  logger.debug(`Маршрут запроса: [${req.method}] ${req.url}`);
  next();
};
