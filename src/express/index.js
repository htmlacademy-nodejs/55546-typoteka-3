'use strict';

const path = require(`path`);
const express = require(`express`);
const appRoutes = require(`./routes`);

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
const categoriesRoute = require(`./routes/categories`);

const getUser = require(`./middleware/get-user`);
const clientError = require(`./middleware/404`);
const debugLog = require(`./middleware/debug-log`);
const webSocket = require(`./middleware/web-socket`);
const setAdminId = require(`./middleware/set-admin-id`);
const axios = require(`./middleware/axios`);

const STATIC_DIR = path.join(__dirname, `public`);
const SESSION_SECRET = `SECRET_SESSION`;
const SESSION_NAME = `session_id`;

const app = express();

app.set(`view engine`, `pug`);
app.set(`views`, path.join(__dirname, `templates`));

app.use(express.static(STATIC_DIR));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(axios);
app.use(setAdminId);
app.use(webSocket(app));

app.use(expressSession({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: SESSION_NAME
}));

app.use(getUser);
app.use(debugLog);

apiArticles(app, dataServiceArticle);
apiCategories(app, dataServiceCategory);
apiSearch(app, dataServiceSearch);
apiComments(app, dataServiceComment);
apiUser(app, dataServiceUser);

app.use(appRoutes);

app.use(`/`, userRoute);
app.use(`/articles`, articlesRoute);
app.use(`/categories`, categoriesRoute);
app.use(clientError);

module.exports = app;
