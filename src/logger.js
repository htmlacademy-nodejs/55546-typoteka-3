'use strict';

const pino = require(`pino`);

const LoggerConfig = {
  NAME: `pino-and-express`,
  DEFAULT_LEVEL: `info`,
};

const level = process.env.LOG_LEVEL;
const logger = pino({
  name: LoggerConfig.NAME,
  level: level ? level.trim() : LoggerConfig.DEFAULT_LEVEL
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
