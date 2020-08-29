'use strict';

const http = require(`http`);
const io = require(`socket.io`);
const {SocketEvent} = require(`./socket-event`);
const logger = require(`./logger`).getLogger();

const MIN_SOCKET_INDEX = 0;
const USER_COUNT_REMOVE = 1;

module.exports = (app) => {
  logger.info(`SocketIO start`);

  app.set(`socketObject`, {
    clients: [],
    distribution(action, data) {
      this.clients.forEach((client) => client.emit(action, data));
      return this;
    }
  });

  const server = http.createServer(app);
  io(server).on(SocketEvent.CONNECTION, (socket) => {
    const {address: ip} = socket.handshake;
    console.log(`Новое подключение: ${ip}`);

    const socketObject = app.get(`socketObject`);
    socketObject.clients.push(socket);

    socket.on(SocketEvent.DISCONNECT, () => {
      const foundSocketIndex = socketObject.clients.indexOf(socket);
      if (foundSocketIndex > MIN_SOCKET_INDEX) {
        socketObject.clients.splice(foundSocketIndex, USER_COUNT_REMOVE);
      }

      console.log(`Клиент отключён: ${ip}`);
    });
  });

  return server;
};
