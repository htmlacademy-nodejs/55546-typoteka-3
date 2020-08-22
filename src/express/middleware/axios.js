'use strict';

const axios = require(`axios`);

module.exports = (req, res, next) => {
  req.axios = axios.create({
    baseURL: `http://${req.headers.host}`
  });

  next();
};
