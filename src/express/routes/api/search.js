'use strict';

const fs = require(`fs`).promises;
const router = require(`express`).Router;
const route = router();

const logger = require(`../../../logger`).getLogger();

const getArticles = async () => JSON.parse((await fs.readFile(`mock.json`)).toString());

// GET / api / search ? query = — возвращает результаты поиска.Поиск публикаций выполняется по заголовку.Публикация соответствует поиску в случае наличия хотя бы одного вхождения искомой фразы.
route.get(`/`, async (req, res) => {
  res.json((await getArticles()).filter((it) => it.title.toLowerCase().includes(req.query.query.toLowerCase())));
  logger.info(`Status code ${res.statusCode}`);
});

module.exports = route;
