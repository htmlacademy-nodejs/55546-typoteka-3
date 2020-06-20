'use strict';

const sequelize = require(`../db/sequelize`);

class SearchService {
  async findOne(id) {
    const {User} = (await sequelize()).models;
    return (await User.findByPk(+id));
  }

  async create(data) {
    const {User} = (await sequelize()).models;
    await User.create(data);
  }

  async checkEmail(email) {
    const {User} = (await sequelize()).models;
    return (await User.findOne({where: {email}})) === null;
  }
}

module.exports = SearchService;
