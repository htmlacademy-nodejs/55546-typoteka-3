'use strict';

const fs = require(`fs`).promises;
const router = require(`express`).Router;
const route = router();

const getDataByFile = async (path) => (await fs.readFile(path)).toString().trim().split(`\n`);

// GET / api / categories — возвращает список категорий;
route.get(`/`, async (req, res) => {
  res.json(await getDataByFile(`data/categories.txt`));
});

module.exports = route;
