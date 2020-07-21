'use strict';

const {ADMIN_ID} = require(`../../const`);

module.exports = (req, res, next) => {
  if (req.session[`user_id`] !== ADMIN_ID) {
    res.redirect(`/login`);
    return;
  }

  next();
};
