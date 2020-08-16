'use strict';

const pino = require(`pino`);

const level = process.env.LOG_LEVEL;
const logger = pino({
  name: `pino-and-express`,
  level: level ? level.trim() : `info`
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
