'use strict';

const fs = require(`fs`).promises;
const router = require(`express`).Router;
const route = router();

route.get(`/`, async (req, res) => {
  let offers = JSON.stringify([]);

  try {
    offers = (await (fs.readFile(`mock.json`))).toString();
  } catch (err) {
    console.error(err);
  }

  res.json(JSON.parse(offers));
});

module.exports = route;
