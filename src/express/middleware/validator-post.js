'use strict';

module.exports = (schema, isObject = false) => (
  async (req, res, next) => {
    const data = req.body;
    try {
      await schema.validateAsync(data, {abortEarly: false});
    } catch (err) {
      res.status(400).json({
        object: !isObject ? null : err.details.reduce((object, {message, context}) => ({
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
