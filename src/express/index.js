'use strict';

const express = require(`express`);
const appRoutes = require(`./routes`);
const app = express();

app.use(appRoutes);

const PORT = 8080;

app.listen(PORT);
