'use strict';

const fs = require(`fs`).promises;
const router = require(`express`).Router;
const route = router();

const logger = require(`../../logger`).getLogger();

route.get(`/`, async (req, res) => {
  let offers = JSON.stringify([]);

  try {
    offers = (await (fs.readFile(`mock.json`))).toString();
  } catch (err) {
    logger.error(`Status code ${res.statusCode}`);
    return;
  }

  res.json(JSON.parse(offers));
  logger.info(`Status code ${res.statusCode}`);
});

module.exports = route;
