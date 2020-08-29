'use strict';

const {literal} = require(`sequelize`);
const sequelize = require(`../db/sequelize`);
const {PAGINATION_LIMIT} = require(`../../const`);
const {wrapperDataService} = require(`../../utils`);

const POPULAR_LIMIT = 4;
const OFFSET_PAGE = 1;
const DEFAULT_ARTICLE_COUNT = 0;

class ArticleService {
  static findOne(id) {
    return wrapperDataService(async () => {
      const {Article, Comment, Category} = (await sequelize()).models;
      return (await Article.findByPk(id, {
        include: [
          {
            model: Comment,
            as: `comments`,
            include: [`author`]
          },
          {
            model: Category,
            as: `categories`,
            attributes: [
              `id`,
              `title`,
              [literal(`(SELECT COUNT("articleId") FROM "articles_category" WHERE "categories"."id" = "articles_category"."categoryId")`), `articlesCount`]
            ]
          }
        ],
        order: [literal(`"comments.dateCreate" DESC`)]
      })).toJSON();
    }, `Ошибка при получении конкретной статьи`, null);
  }

  static findAll() {
    return wrapperDataService(async () => {
      const {Article} = (await sequelize()).models;
      return (await Article.findAll({
        include: [`categories`, `comments`],
        order: [literal(`"dateCreate" DESC`)]
      })).map((article) => article.toJSON());
    }, `Ошибка при получении списка всех статей`, []);
  }

  static findAllByPage(page) {
    return wrapperDataService(async () => {
      const {Article} = (await sequelize()).models;
      return (await Article.findAll({
        include: [`categories`, `comments`],
        limit: PAGINATION_LIMIT,
        offset: ((page - OFFSET_PAGE) * PAGINATION_LIMIT),
        order: [literal(`"dateCreate" DESC`)]
      })).map((article) => article.toJSON());
    }, `Ошибка при получении списка статей для страницы`, []);
  }

  static getCount() {
    return wrapperDataService(async () => {
      return await (await sequelize()).models.Article.count();
    }, `Ошибка при получении количества всех статей`, DEFAULT_ARTICLE_COUNT);
  }

  static findAllByCategory(categoryId, page) {
    return wrapperDataService(async () => {
      const {Article, ArticleCategory} = (await sequelize()).models;
      return (await Article.findAll({
        include: [`categories`, `comments`],
        where: {
          id: await ArticleCategory.findAll({
            where: {categoryId},
            attributes: [`articleId`],
            raw: true
          }).map((data) => +data.articleId),
        },
        limit: PAGINATION_LIMIT,
        offset: ((page - OFFSET_PAGE) * PAGINATION_LIMIT),
        order: [literal(`"dateCreate" DESC`)]
      })).map((article) => article.toJSON());
    }, `Ошибка при получении списка статей для страницы в категории`, []);
  }

  static getCountByCategory(categoryId) {
    return wrapperDataService(async () => {
      return await (await sequelize()).models.ArticleCategory
        .count({where: {categoryId}});
    }, `Ошибка при получении количества всех статей в категории`, DEFAULT_ARTICLE_COUNT);
  }

  static findPopular() {
    return wrapperDataService(async () => {
      const {Article} = (await sequelize()).models;
      return (await Article.findAll({
        attributes: {
          include: [
            [literal(`(SELECT COUNT("articleId") FROM "comments" WHERE "comments"."articleId" = "Article"."id")`), `commentsCount`],
          ]
        },
        limit: POPULAR_LIMIT,
        order: [literal(`"commentsCount" DESC`)]
      })).map((article) => article.toJSON());
    }, `Ошибка при получении списка популярных статей`, []);
  }

  static create(data) {
    return wrapperDataService(async () => {
      const {Article} = (await sequelize()).models;
      return await Article.create(data);
    }, `Ошибка при создании новой статьи`, null);
  }

  static update(id, data) {
    return wrapperDataService(async () => {
      const {Article} = (await sequelize()).models;
      return await Article.update(data, {where: {id}});
    }, `Ошибка при обновлении статьи`, null);
  }

  static delete(id) {
    return wrapperDataService(async () => {
      const {Article} = (await sequelize()).models;
      return await Article.destroy({where: {id}});
    }, `Ошибка при удалении статьи`, null);
  }
}

module.exports = ArticleService;
