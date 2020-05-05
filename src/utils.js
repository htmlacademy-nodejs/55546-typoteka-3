'use strict';

const fs = require(`fs`).promises;

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getUrlRequest = (req, path) => new URL(path, `http://${(`` + req.headers.host)}`).href;

const getDataByFile = async (path) => (await fs.readFile(path)).toString().trim().split(`\n`);

const getArticleData = async () => ({
  titles: await getDataByFile(`data/titles.txt`),
  sentences: await getDataByFile(`data/sentences.txt`),
  categories: await getDataByFile(`data/categories.txt`),
  comments: await getDataByFile(`data/comments.txt`),
});

module.exports = {
  getArticleData,
  getRandomInt,
  shuffle,
  getUrlRequest,
};
