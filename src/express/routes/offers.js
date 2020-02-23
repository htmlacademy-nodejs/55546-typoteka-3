'use strict';

const router = require(`express`).Router;
const route = router();

route.get(`/offers/category/:id`, (req, res) => {
  res.render(`publications-by-category`);
});

route.get(`/offers/add`, (req, res) => {
  res.render(`admin-add-new-post-empty`);
});

route.get(`/offers/edit/:id`, (req, res) => {
  res.render(`admin-add-new-post`);
});

route.get(`/offers/:id`, (req, res) => {
  res.render(`post-user`);
});

module.exports = route;
