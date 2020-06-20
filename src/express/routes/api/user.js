'use strict';

const bcrypt = require(`bcrypt`);
const logger = require(`../../../logger`).getLogger();
const router = require(`express`).Router;
const route = router();
const {PASSWORD_SALT} = require(`../../../const`);

const validatorMiddleware = require(`../../middleware/validator-post`);
const registerSchemaValidator = require(`../../validators/user`).register;

module.exports = async (app, ClassService) => {
  logger.info(`Подключение user api`);

  const service = new ClassService();

  app.use(`/api/user`, route);
  route.post(`/`, validatorMiddleware(registerSchemaValidator), async (req, res) => {
    const {body} = req;

    if (!(await service.checkEmail(body.email))) {
      res.status(400).json({message: [`Указанный почтовый ящик уже используется`], data: {}});
      return;
    }

    try {
      await service.create({...body, password: bcrypt.hashSync(body.password, PASSWORD_SALT)});
      logger.info(`Создан новый пользователь`);
    } catch (err) {
      res.status(400).json(`Ошибка при создании нового пользователя: ${err}`);
    }

    res.status(200).json({result: `Создан новый пользователь`});
  });
};
