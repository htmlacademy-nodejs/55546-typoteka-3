'use strict';

const config = require(`../../config`);
const logger = require(`../../logger`).getLogger();
const {Pool} = require(`pg`);

const pool = new Pool({
  host: config.DB_PGHOST,
  port: config.DB_PGPORT,
  user: config.DB_PGUSER,
  database: config.DB_PGDATABASE,
  password: config.DB_PGPASSWORD
});

module.exports = async () => {
  logger.info(`Подключение к БД`);

  try {
    const client = await pool.connect();
    logger.info(`Соединение установлено`);

    client.release();

    return pool;
  } catch (err) {
    logger.error(`Ошибка при подключении к БД: ${err}`);
  }

  return false;
};
