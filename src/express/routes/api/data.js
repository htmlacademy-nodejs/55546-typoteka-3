'use strict';

const {SocketEvent} = require(`../../../socket-event`);
const {HttpCode} = require(`../../../http-code`);

const router = require(`express`).Router;
const route = router();

route.get(`/get-socket-event-const`, (req, res) => {
  res.status(HttpCode.OK).json(SocketEvent);
});

module.exports = route;
