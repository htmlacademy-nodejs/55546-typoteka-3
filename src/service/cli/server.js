'use strict';

const config = require(`../../config`);
const logger = require(`../../logger`).getLogger();
const app = require(`../../express`);
const socketServer = require(`../../socket-server`);

const DEFAULT_PORT = 8080;

const getPort = () => {
  if (process.env.PORT) {
    return +(process.env.PORT.trim());
  }

  return +(config.PORT || DEFAULT_PORT);
};

module.exports = {
  name: `--server`,
  run() {
    socketServer(app).listen(getPort(), () => {
      logger.info(`Запуск сервера`);
    }).on(`error`, (err) => {
      logger.error(`Server can't start. Error: ${err}`);
    });
  }
};
