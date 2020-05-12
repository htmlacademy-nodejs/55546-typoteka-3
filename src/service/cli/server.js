'use strict';

const config = require(`../../config`);
const db = require(`../db`);
const logger = require(`../../logger`).getLogger();
const app = require(`../../express`);

const DEFAULT_PORT = 8080;

const getPort = () => {
  if (process.env.PORT) {
    return +(process.env.PORT.trim());
  }

  return +(config.PORT || DEFAULT_PORT);
};

module.exports = {
  name: `--server`,
  async run() {
    const dbPool = await db();
    if (!dbPool) {
      logger.error(`Завершение работы из за проблем соединения с БД`);
      process.exit(1);
    }

    app.listen(getPort(), () => {
      app.set(`db`, dbPool);
      logger.info(`Запуск сервера`);
    }).on(`error`, (err) => {
      logger.error(`Server can't start. Error: ${err}`);
    });
  }
};
