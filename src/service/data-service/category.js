'use strict';

const {literal} = require(`sequelize`);
const sequelize = require(`../db/sequelize`);

class CategoryService {
  async findOne(id) {
    const {Category} = (await sequelize()).models;
    return (await Category.findByPk(id, {
      attributes: {
        include: [[literal(`(SELECT COUNT(*) FROM articles_category WHERE "Category"."id" = articles_category.category_id)`), `articlesCount`]]
      }
    })).toJSON();
  }

  async findAll() {
    const {Category} = (await sequelize()).models;
    return (await Category.findAll({
      attributes: {
        include: [[literal(`(SELECT COUNT(*) FROM articles_category WHERE "Category"."id" = articles_category.category_id)`), `articlesCount`]]
      }
    })).map((category) => category.toJSON());
  }

  async create(data) {
    const {Category} = (await sequelize()).models;
    return await Category.create(data);
  }

  async update(id, data) {
    const {Category} = (await sequelize()).models;
    return await Category.update(data, {where: {id}});
  }

  async delete(id) {
    const {Category} = (await sequelize()).models;
    return await Category.destroy({where: {id}});
  }

  async setArticleCategory(articleId, categories) {
    const {ArticleCategory} = (await sequelize()).models;
    await ArticleCategory.destroy({where: {'category_id': +articleId}});
    await ArticleCategory.bulkCreate(categories.map(
        (categoryId) => ({'article_id': +articleId, 'category_id': +categoryId})));
  }

  async deleteByArticle(articleId) {
    const {ArticleCategory} = (await sequelize()).models;
    await ArticleCategory.destroy({where: {'article_id': +articleId}});
  }
}

module.exports = CategoryService;
