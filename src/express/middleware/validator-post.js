'use strict';

module.exports = (schema) => (
  async (req, res, next) => {
    const data = req.body;
    try {
      await schema.validateAsync(data, {abortEarly: false});
    } catch (err) {
      res.status(400).json({message: err.details.map(({message}) => message), data});
      return;
    }

    next();
  }
);
