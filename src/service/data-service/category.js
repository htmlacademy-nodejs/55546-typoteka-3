'use strict';

const {literal} = require(`sequelize`);
const sequelize = require(`../db/sequelize`);

class CategoryService {
  static async findOne(id) {
    const {Category} = (await sequelize()).models;
    return (await Category.findByPk(id, {
      attributes: {
        include: [[literal(`(SELECT COUNT(*) FROM articles_category WHERE "Category"."id" = articles_category.category_id)`), `articlesCount`]]
      }
    })).toJSON();
  }

  static async findAll() {
    const {Category} = (await sequelize()).models;
    return (await Category.findAll({
      attributes: {
        include: [[literal(`(SELECT COUNT(*) FROM articles_category WHERE "Category"."id" = articles_category.category_id)`), `articlesCount`]]
      }
    })).map((category) => category.toJSON());
  }

  static async create(data) {
    const {Category} = (await sequelize()).models;
    return await Category.create(data);
  }

  static async update(id, data) {
    const {Category} = (await sequelize()).models;
    return await Category.update(data, {where: {id}});
  }

  static async delete(id) {
    const {Category} = (await sequelize()).models;
    return await Category.destroy({where: {id}});
  }

  static async setArticleCategory(articleId, categories) {
    const {ArticleCategory} = (await sequelize()).models;
    await ArticleCategory.destroy({where: {'category_id': +articleId}});
    await ArticleCategory.bulkCreate(categories.map(
        (categoryId) => ({'article_id': +articleId, 'category_id': +categoryId})));
  }

  static async getIsAddedCategories(categoryId) {
    const {ArticleCategory} = (await sequelize()).models;
    return !!(await ArticleCategory.findOne({where: {'category_id': +categoryId}}));
  }
}

module.exports = CategoryService;
