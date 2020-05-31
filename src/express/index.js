'use strict';

const path = require(`path`);
const express = require(`express`);
const appRoutes = require(`./routes`);
const app = express();

const logger = require(`../logger`).getLogger();
const STATIC_DIR = path.join(__dirname, `public`);

const apiArticles = require(`./routes/api/articles`);
const apiCategories = require(`./routes/api/categories`);
const apiSearch = require(`./routes/api/search`);
const apiComments = require(`./routes/api/comments`);

const dataServiceArticle = require(`../service/data-service/article`);
const dataServiceCategory = require(`../service/data-service/category`);
const dataServiceSearch = require(`../service/data-service/search`);
const dataServiceComment = require(`../service/data-service/comment`);

app.set(`view engine`, `pug`);
app.set(`views`, path.join(__dirname, `templates`));

app.use(express.static(STATIC_DIR));
app.use(express.json());

app.use((_req, res, next) => {
  res.db = app.get(`db`);
  next();
});

app.use((req, res, next) => {
  logger.debug(`Маршрут запроса: ${req.url}`);
  next();
});

apiArticles(app, dataServiceArticle);
apiCategories(app, dataServiceCategory);
apiSearch(app, dataServiceSearch);
apiComments(app, dataServiceComment);

app.use(appRoutes);

app.use(`/articles`, require(`./routes/articles`));
app.use(`/posts`, require(`./routes/posts`));

module.exports = app;
