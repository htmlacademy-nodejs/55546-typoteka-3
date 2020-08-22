'use strict';

const sequelize = require(`../db/sequelize`);
const {Op, literal} = require(`sequelize`);

class SearchService {
  static async getSearch(title) {
    const {Article} = (await sequelize()).models;
    return await Article.findAll({
      raw: true,
      where: {
        title: {
          [Op.iLike]: `%${title}%`
        }
      },
      order: [literal(`"date_create" DESC`)]
    });
  }
}

module.exports = SearchService;
