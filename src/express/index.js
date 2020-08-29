'use strict';

const path = require(`path`);
const express = require(`express`);
const appRoutes = require(`./routes`);

const apiArticles = require(`./routes/api/articles`);
const apiCategories = require(`./routes/api/categories`);
const apiSearch = require(`./routes/api/search`);
const apiComments = require(`./routes/api/comments`);
const apiUser = require(`./routes/api/user`);
const apiData = require(`./routes/api/data`);

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
const setAdminId = require(`./middleware/set-admin-id`);
const setAxios = require(`./middleware/set-axios`);
const setRequestHelper = require(`./middleware/set-request-helper`);

const {SESSION_SECRET, SESSION_NAME} = require(`../const`);

const STATIC_DIR = path.join(__dirname, `public`);

const app = express();

app.set(`view engine`, `pug`);
app.set(`views`, path.join(__dirname, `templates`));

app.use(express.static(STATIC_DIR));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(setAxios);
app.use(setRequestHelper);
app.use(setAdminId);

app.use(expressSession({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: SESSION_NAME
}));

app.use(getUser);
app.use(debugLog);

app.use(`/api/data`, apiData);

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
