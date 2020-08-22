'use strict';

const path = require(`path`);
const moment = require(`moment`);
const fs = require(`fs`).promises;

const MIN_COUNT_PAGE = 1;
const OFFSET_NEXT_PAGE = 1;

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getDataByFile = async (dataPath) => (await fs.readFile(dataPath)).toString().trim().split(`\n`);

const getArticleData = async () => ({
  titles: await getDataByFile(`data/titles.txt`),
  sentences: await getDataByFile(`data/sentences.txt`),
  categories: await getDataByFile(`data/categories.txt`),
  comments: await getDataByFile(`data/comments.txt`),
});

const createPagination = (total, limit, activePage) => {
  const countPage = Math.ceil(total / limit);

  return {
    isActive: countPage > MIN_COUNT_PAGE,
    next: {status: activePage >= MIN_COUNT_PAGE && activePage < countPage, page: +activePage + OFFSET_NEXT_PAGE},
    prev: {status: activePage > MIN_COUNT_PAGE && activePage <= countPage, page: +activePage - OFFSET_NEXT_PAGE},
    pages: Array.from({length: countPage},
        (_it, idx) => ({page: idx + 1, isActive: +activePage === (idx + 1)}))
  };
};

const createMulterStorage = (savePathDir) => ({
  destination(req, file, cb) {
    cb(null, savePathDir);
  },
  filename(req, file, cb) {
    cb(null, `${+(Date.now())}${path.extname(file.originalname)}`);
  }
});

const getCorrectDateFormat = (date) => moment(date).format(`DD.MM.YYYY hh:mm`);

const setCorrectDate = (elements = []) => elements.map((element) => {
  element[`date_create`] = getCorrectDateFormat(element[`date_create`]);
  return element;
});

const getRandomDate = (monthDifference) => {
  const baseDatetime = new Date();
  baseDatetime.setMonth(monthDifference);
  return moment(getRandomInt(+baseDatetime, +Date.now())).format(`YYYY.MM.DD. hh:mm:ss`);
};

module.exports = {
  getArticleData,
  getRandomInt,
  shuffle,
  createPagination,
  createMulterStorage,
  getRandomDate,
  getCorrectDateFormat,
  setCorrectDate,
};
