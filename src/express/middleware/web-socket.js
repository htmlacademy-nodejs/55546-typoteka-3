'use strict';

const socketObject = {
  clients: []
};

module.exports = (app) => {
  app.set(`socketObject`, socketObject);

  return (req, res, next) => {
    req.socket = socketObject;
    next();
  };
};
