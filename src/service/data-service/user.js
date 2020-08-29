'use strict';

const sequelize = require(`../db/sequelize`);
const bcrypt = require(`bcrypt`);
const {wrapperDataService} = require(`../../utils`);

class SearchService {
  static findOne(id) {
    return wrapperDataService(async () => {
      const {User} = (await sequelize()).models;
      return (await User.findByPk(+id));
    }, `Ошибка при получении конкретного пользователя`, null);
  }

  static create(data) {
    return wrapperDataService(async () => {
      const {User} = (await sequelize()).models;
      await User.create(data);
    }, `Ошибка при создании нового пользователя`, null);
  }

  static getIsEmailExist(email) {
    return wrapperDataService(async () => {
      const {User} = (await sequelize()).models;
      return !(await User.findOne({where: {email}}));
    }, `Ошибка при проверка занятости почтового ящика`, null, true);
  }

  static authorize(email, password) {
    return wrapperDataService(async () => {
      const {User} = (await sequelize()).models;
      const user = await User.findOne({where: {email}});

      if (!user) {
        return {
          status: false,
          message: [`Пользователь с указанным email не найден.`]
        };
      }

      if (!bcrypt.compareSync(password, user.password)) {
        return {
          status: false,
          message: [`Введён не верный пароль`]
        };
      }

      return {status: true, user};
    }, `Ошибка при проверка занятости почтового ящика`, null);
  }
}

module.exports = SearchService;
