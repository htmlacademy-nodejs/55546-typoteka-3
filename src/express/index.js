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
const apiUser = require(`./routes/api/user`);

const expressSession = require(`express-session`);

const dataServiceArticle = require(`../service/data-service/article`);
const dataServiceCategory = require(`../service/data-service/category`);
const dataServiceSearch = require(`../service/data-service/search`);
const dataServiceComment = require(`../service/data-service/comment`);
const dataServiceUser = require(`../service/data-service/user`);

const articlesRoute = require(`./routes/articles`);
const userRoute = require(`./routes/user`);

const getUser = require(`./middleware/get-user`);

app.set(`view engine`, `pug`);
app.set(`views`, path.join(__dirname, `templates`));

app.use(express.static(STATIC_DIR));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(expressSession({
  secret: `SECRET_SESSION`,
  resave: false,
  saveUninitialized: false,
  name: `session_id`
}));
app.use(getUser);

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
apiUser(app, dataServiceUser);

app.use(appRoutes);

app.use(`/articles`, articlesRoute);
app.use(`/user`, userRoute);

module.exports = app;
