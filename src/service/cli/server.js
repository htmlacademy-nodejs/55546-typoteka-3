'use strict';

const logger = require(`../../logger`).getLogger();

const DEFAULT_PORT = 8080;

module.exports = {
  name: `--server`,
  run() {
    const envPort = process.env.PORT;
    require(`../../express`).listen(envPort ? envPort.trim() : DEFAULT_PORT, () => {
      logger.info(`Запуск сервера`);
    }).on(`error`, (err) => {
      logger.error(`Server can't start. Error: ${err}`);
    });
  }
};
