'use strict';

const RequestHelper = require(`../../requiest-helper`);

module.exports = async (req, res, next) => {
  req.requestHelper = new RequestHelper(req, res);
  next();
};
