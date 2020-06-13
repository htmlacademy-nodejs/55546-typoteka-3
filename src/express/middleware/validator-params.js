'use strict';

const Joi = require(`@hapi/joi`);

const validators = {
  string: Joi.string().required(),
  number: Joi.number().required(),
};

module.exports = (paramName, dataType) => (
  async (req, res, next) => {
    const data = req.params;
    const param = data[paramName];

    if (!Object.keys(validators).includes(dataType) || !param) {
      next();
    }

    try {
      await validators[dataType].validateAsync(param);
    } catch (err) {
      res.status(400).json({message: err.details.map(({message}) => message), param});
      return;
    }

    next();
  }
);
