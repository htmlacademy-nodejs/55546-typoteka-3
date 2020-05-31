'use strict';

const {Op} = require(`sequelize`);
const sequelize = require(`../db/sequelize`);

class SearchService {
  async search(title) {
    const {Article} = (await sequelize()).models;
    return await Article.findAll({
      raw: true,
      where: {
        title: {
          [Op.like]: `%${title}%`
        }
      }
    });
  }
}

module.exports = SearchService;
