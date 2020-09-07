'use strict';

const path = require(`path`);
const moment = require(`moment`);
const {HttpCode} = require(`./http-code`);
const logger = require(`./logger`).getLogger();
const fs = require(`fs`).promises;

const MOCK_DATA_PATH = `data`;
const MIN_COUNT_PAGE = 1;
const OFFSET_PAGE = 1;
const OFFSET_NEXT_PAGE = 1;
const RANDOM_INT_OFFSET = 1;

const RANDOM_DATE_FORMAT = `YYYY.MM.DD. hh:mm:ss`;

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + RANDOM_INT_OFFSET)) + min;

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getDataByFile = (dataPath) => fs.readFile(dataPath)
  .then((result) => result.toString().trim().split(`\n`))
  .catch((error) => {
    console.error(`Ошибка при получении данных из файла ${dataPath}: ${error}`);
    return [];
  });

const getArticleData = async () => {
  const [titles, sentences, categories, comments] = await Promise.all([
    getDataByFile(`${MOCK_DATA_PATH}/titles.txt`),
    getDataByFile(`${MOCK_DATA_PATH}/sentences.txt`),
    getDataByFile(`${MOCK_DATA_PATH}/categories.txt`),
    getDataByFile(`${MOCK_DATA_PATH}/comments.txt`),
  ])
  .catch((error) => {
    console.log(`Ошибка при получении данных: ${error}`);
    return [];
  });

  return {titles, sentences, categories, comments};
};

const createPagination = (total, limit, activePage) => {
  const countPage = Math.ceil(total / limit);

  return {
    isActive: countPage > MIN_COUNT_PAGE,
    next: {status: activePage >= MIN_COUNT_PAGE && activePage < countPage, page: +activePage + OFFSET_NEXT_PAGE},
    prev: {status: activePage > MIN_COUNT_PAGE && activePage <= countPage, page: +activePage - OFFSET_NEXT_PAGE},
    pages: Array.from({length: countPage}, (_it, idx) =>
      ({page: idx + OFFSET_PAGE, isActive: +activePage === (idx + OFFSET_PAGE)}))
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

const getRandomDate = (monthDifference) => {
  const baseDatetime = new Date();
  baseDatetime.setMonth(monthDifference);
  return moment(getRandomInt(+baseDatetime, +Date.now())).format(RANDOM_DATE_FORMAT);
};

const deleteImage = (imagePath) => {
  fs.unlink(imagePath)
    .catch((err) => {
      logger.error(`Ошибка при удалении файла: ${err}`);
    });
};

const getValidateErrorInfo = ({response}) => {
  if (response && response.data) {
    const {message, object} = response.data;
    logger.error(`Ошибка валидации: ${message}`);
    return {errors: message, objectError: object};
  }

  return {errors: null, objectError: {}};
};

const runAsyncWrapper = (callback, callbackError) => (req, res, next) =>
  callback(req, res, next)
    .catch(typeof callbackError === `function` ? callbackError(req, res) : next);

const callbackErrorApi = (textError = `Ошибка`, status = HttpCode.BAD_REQUEST) => (req, res) => (error) => {
  logger.error(`${textError}: ${error}`);
  res.sendStatus(status);
};

const wrapperDataService = async (callback, textError, errorReturn, isThrowError = false) => {
  try {
    return callback();
  } catch (err) {
    if (isThrowError) {
      throw new Error(textError);
    }
    logger.error(`${textError}: ${err}`);
  }

  return errorReturn;
};

module.exports = {
  getArticleData,
  getRandomInt,
  shuffle,
  createPagination,
  createMulterStorage,
  getRandomDate,
  deleteImage,
  getValidateErrorInfo,
  runAsyncWrapper,
  callbackErrorApi,
  wrapperDataService,
};
