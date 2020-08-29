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
const {HttpCode: {OK, BAD_REQUEST, CREATED}} = require(`../../../http-code`);
const {runAsyncWrapper, callbackErrorApi} = require(`../../../utils`);

const route = router();

module.exports = async (app, service) => {
  logger.info(`Подключение user api`);

  app.use(`/api/user`, route);

  route.post(`/`, validatorMiddleware(registerSchemaValidator), runAsyncWrapper(async (req, res) => {
    const {body} = req;
    if (!(await service.getIsEmailExist(body.email))) {
      res.status(BAD_REQUEST).json({message: [`Указанный почтовый ящик уже используется`], data: {}});
      return;
    }

    await service.create({...body, password: bcrypt.hashSync(body.password, PASSWORD_SALT)});
    res.sendStatus(CREATED);
  }, callbackErrorApi(`Ошибка при создании нового пользователя`)));


  route.get(`/get/:id`, runAsyncWrapper(async (req, res) => {
    res.status(OK).json(await service.findOne(req.params.id));
  }, callbackErrorApi(`Ошибка при получении пользователя`)));

  route.post(`/login`, validatorMiddleware(loginSchemaValidator), runAsyncWrapper(async (req, res) => {
    const {email, password} = req.body;
    const {status, message, user} = await service.authorize(email, password);
    if (!status) {
      res.status(BAD_REQUEST).json({message, data: {}});
      return;
    }

    res.status(OK).json(user);
  }, callbackErrorApi(`Ошибка при авторизации пользователя`)));
};
