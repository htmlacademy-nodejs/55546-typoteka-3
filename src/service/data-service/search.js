'use strict';

const {Op, literal} = require(`sequelize`);
const sequelize = require(`../db/sequelize`);

class SearchService {
  async search(title) {
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
