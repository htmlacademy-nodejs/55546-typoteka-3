'use strict';

const config = require(`../../config`);
const logger = require(`../../logger`).getLogger();
const app = require(`../../express/app`);
const socketServer = require(`../../socket-server`);

const DEFAULT_PORT = 8080;

const getPort = () => +(process.env.PORT ? process.env.PORT.trim() : (config.PORT || DEFAULT_PORT));

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
