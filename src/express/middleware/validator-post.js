'use strict';

const {HttpCode} = require(`../../http-code`);

module.exports = (schema) => (
  async (req, res, next) => {
    const data = req.body;
    try {
      await schema.validateAsync(data, {abortEarly: false});
    } catch (err) {
      res.status(HttpCode.BAD_REQUEST).json({
        object: err.details.reduce((object, {message, context}) => ({
          ...object,
          [context.label]: message
        }), {}),
        message: err.details.map(({message}) => message),
        data
      });
      return;
    }

    next();
  }
);
