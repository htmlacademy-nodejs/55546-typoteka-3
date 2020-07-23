'use strict';

const axios = require(`axios`);
const {getUrlRequest} = require(`../../utils`);

module.exports = async (req, res, next) => {
  try {
    await axios.delete(getUrlRequest(req, `/api/comments/check-is-author/
      ${req.params.id}/${req.session[`user_id`]}`));
  } catch (err) {
    res.redirect(`/`);
    return;
  }

  next();
};
