'use strict';

const sequelize = require(`../db/sequelize`);
const {Op, literal} = require(`sequelize`);
const {wrapperDataService} = require(`../../utils`);

class SearchService {
  static getSearch(title) {
    return wrapperDataService(async () => {
      const {Article} = (await sequelize()).models;
      return await Article.findAll({
        raw: true,
        where: {
          title: {
            [Op.iLike]: `%${title}%`
          }
        },
        order: [literal(`"dateCreate" DESC`)]
      });
    }, `Ошибка при поиске статей по заголовку`, []);
  }
}

module.exports = SearchService;
