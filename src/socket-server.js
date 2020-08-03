'use strict';

const http = require(`http`);
let io = require(`socket.io`);
const logger = require(`./logger`).getLogger();

module.exports = (app) => {
  logger.info(`SocketIO start`);

  const server = http.createServer(app);
  app.request.socket = io(server).on(`connection`, (socket) => {
    const {address: ip} = socket.handshake;
    console.log(`Новое подключение: ${ip}`);

    // socket.on(`update-artciles`, () => {
    //   socket.broadcast.emit(`update-artciles`, {status: `update-artciles`});
    // });

    // socket.on(`update-comments`, () => {
    //   socket.broadcast.emit(`update-comments`, {status: `update-comments`});
    // });

    socket.on(`disconnect`, () => {
      console.log(`Клиент отключён: ${ip}`);
    });

    socket.send(`[Server]: Добро пожаловать в чат.`);
  });

  return server;
};
