'use strict';

const bcrypt = require(`bcrypt`);
const logger = require(`../../../logger`).getLogger();
const router = require(`express`).Router;
const validatorMiddleware = require(`../../middleware/validator-post`);
const {
  register: registerSchemaValidator,
  login: loginSchemaValidator,
} = require(`../../validators/user`);
const {PASSWORD_SALT} = require(`../../../const`);

const route = router();

module.exports = async (app, service) => {
  logger.info(`Подключение user api`);

  app.use(`/api/user`, route);

  route.post(`/`, validatorMiddleware(registerSchemaValidator), async (req, res) => {
    const {body} = req;

    if (!(await service.getIsEmailExist(body.email))) {
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

  route.get(`/get/:id`, async (req, res) => {
    res.status(200).json(await service.findOne(req.params.id));
  });

  route.post(`/login`, validatorMiddleware(loginSchemaValidator), async (req, res) => {
    const {email, password} = req.body;
    const {status, message, user} = await service.authorize(email, password);
    if (!status) {
      res.status(400).json({message, data: {}});
      return;
    }

    res.status(200).json(user);
  });
};
