'use strict';

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const getUrlRequest = (req, path) => new URL(path, `http://${(`` + req.headers.host)}`).href;

module.exports = {
  getRandomInt,
  shuffle,
  getUrlRequest,
};
