'use strict';

const http = require(`http`);
const io = require(`socket.io`);
const logger = require(`./logger`).getLogger();

module.exports = (app) => {
  logger.info(`SocketIO start`);

  const server = http.createServer(app);
  io(server).on(`connection`, (socket) => {
    const {address: ip} = socket.handshake;
    console.log(`Новое подключение: ${ip}`);

    const socketObject = app.get(`socketObject`);
    socketObject.clients.push(socket);

    socket.on(`disconnect`, () => {
      const foundSocketIndex = socketObject.clients.indexOf(socket);
      if (foundSocketIndex > 0) {
        socketObject.clients.splice(foundSocketIndex, 1);
      }

      console.log(`Клиент отключён: ${ip}`);
    });
  });

  return server;
};
