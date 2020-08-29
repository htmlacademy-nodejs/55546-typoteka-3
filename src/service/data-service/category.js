'use strict';

const {literal} = require(`sequelize`);
const sequelize = require(`../db/sequelize`);
const {wrapperDataService} = require(`../../utils`);

class CategoryService {
  static findOne(id) {
    return wrapperDataService(async () => {
      const {Category} = (await sequelize()).models;
      return (await Category.findByPk(id, {
        attributes: {
          include: [[literal(`(SELECT COUNT(*) FROM articles_category WHERE "Category"."id" = "articles_category"."categoryId")`), `articlesCount`]]
        }
      })).toJSON();
    }, `Ошибка при получении конкретной категории`, null);
  }

  static findAll() {
    return wrapperDataService(async () => {
      const {Category} = (await sequelize()).models;
      return (await Category.findAll({
        attributes: {
          include: [[literal(`(SELECT COUNT(*) FROM articles_category WHERE "Category"."id" = "articles_category"."categoryId")`), `articlesCount`]]
        }
      })).map((category) => category.toJSON());
    }, `Ошибка при получении списка всех категорий`, []);
  }

  static create(data) {
    return wrapperDataService(async () => {
      const {Category} = (await sequelize()).models;
      return await Category.create(data);
    }, `Ошибка при создании новой категории`, null);
  }

  static update(id, data) {
    return wrapperDataService(async () => {
      const {Category} = (await sequelize()).models;
      return await Category.update(data, {where: {id}});
    }, `Ошибка при обновлении категории`, null);
  }

  static delete(id) {
    return wrapperDataService(async () => {
      const {Category} = (await sequelize()).models;
      return await Category.destroy({where: {id}});
    }, `Ошибка при удалении категории`, null);
  }

  static setArticleCategory(articleId, categories) {
    return wrapperDataService(async () => {
      const {ArticleCategory} = (await sequelize()).models;
      await ArticleCategory.destroy({where: {articleId: +articleId}});
      await ArticleCategory.bulkCreate(categories.map(
          (categoryId) => ({articleId: +articleId, categoryId: +categoryId})));
      return null;
    }, `Ошибка при установке категорий для статьи`, null);
  }

  static getIsAddedCategories(categoryId) {
    return wrapperDataService(async () => {
      const {ArticleCategory} = (await sequelize()).models;
      return !!(await ArticleCategory.findOne({where: {categoryId: +categoryId}}));
    }, `Ошибка при проверке существования категорий у статьи`, null, true);
  }
}

module.exports = CategoryService;
