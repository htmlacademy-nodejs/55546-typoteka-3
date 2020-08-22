'use strict';

const {ADMIN_ID} = require(`../../const`);

module.exports = async (req, res, next) => {
  res.locals.adminId = ADMIN_ID;
  next();
};
