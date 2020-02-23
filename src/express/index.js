'use strict';

const path = require(`path`);
const express = require(`express`);
const appRoutes = require(`./routes`);
const app = express();

const DEFAULT_PORT = 8080;
const STATIC_DIR = path.join(__dirname, `../../markup`);

app.set(`view engine`, `pug`);
app.set(`views`, path.join(__dirname, `templates`));

app.use(express.json());
app.use(express.static(STATIC_DIR));

app.use(appRoutes);
app.use(`/offers`, require(`./routes/offers`));
app.use(`/posts`, require(`./routes/posts`));

module.exports = (port) => app.listen(port || DEFAULT_PORT);
