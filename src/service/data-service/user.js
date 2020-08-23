'use strict';

const sequelize = require(`../db/sequelize`);
const bcrypt = require(`bcrypt`);

class SearchService {
  static async findOne(id) {
    const {User} = (await sequelize()).models;
    return (await User.findByPk(+id));
  }

  static async create(data) {
    const {User} = (await sequelize()).models;
    await User.create(data);
  }

  static async getIsEmailExist(email) {
    const {User} = (await sequelize()).models;
    return !(await User.findOne({where: {email}}));
  }

  static async authorize(email, password) {
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
  }
}

module.exports = SearchService;
