'use strict';

const {literal, Op} = require(`sequelize`);
const sequelize = require(`../db/sequelize`);

const POPULAR_LIMIT = 4;

const {PAGINATION_LIMIT} = require(`../../const`);

class ArticleService {
  async findOne(id) {
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
            [literal(`(SELECT COUNT(article_id) FROM "articles_category" WHERE "categories"."id" = "articles_category"."category_id")`), `articlesCount`]
          ]
        }
      ],
      order: [literal(`"comments.date_create" DESC`)]
    })).toJSON();
  }

  async findAll() {
    const {Article} = (await sequelize()).models;
    return (await Article.findAll({include: [`categories`, `comments`]}))
      .map((article) => article.toJSON());
  }

  async findAllByPage(page) {
    const {Article} = (await sequelize()).models;
    return (await Article.findAll({
      include: [`categories`, `comments`],
      limit: PAGINATION_LIMIT,
      offset: ((page - 1) * PAGINATION_LIMIT),
    })).map((article) => article.toJSON());
  }

  async getCount() {
    return await (await sequelize()).models.Article.count();
  }

  async findAllByCategory(categoryId, page) {
    const {Article, ArticleCategory} = (await sequelize()).models;
    return (await Article.findAll({
      include: [`categories`, `comments`],
      where: {
        id: await ArticleCategory.findAll({
          where: {'category_id': categoryId},
          attributes: [`article_id`],
          raw: true
        }).map((data) => +data[`article_id`]),
      },
      limit: PAGINATION_LIMIT,
      offset: ((page - 1) * PAGINATION_LIMIT),
    })).map((article) => article.toJSON());
  }

  async getCountByCategory(categoryId) {
    return await (await sequelize()).models.ArticleCategory
      .count({where: {'category_id': categoryId}});
  }

  async findAllByUser(userId) {
    const {Article} = (await sequelize()).models;
    return (await Article.findAll({where: {'author_id': userId}, order: [[`date_create`, `DESC`]]}))
      .map((offer) => offer.toJSON());
  }

  async findPopular() {
    const {Article} = (await sequelize()).models;
    return (await Article.findAll({
      attributes: {
        include: [
          [literal(`(SELECT COUNT(article_id) FROM "comments" WHERE "comments"."article_id" = "Article"."id")`), `commentsCount`],
        ]
      },
      // where: {
      //   commentsCount: {
      //     [Op.gt]: 0
      //   }
      // },
      // where: [
      //   literal(`"commentsCount" > 0`)
      // ],
      limit: POPULAR_LIMIT,
      order: [literal(`"commentsCount" DESC`)]
    })).map((article) => article.toJSON());
  }

  async create(data) {
    const {Article} = (await sequelize()).models;
    return await Article.create(data);
  }

  async update(id, data) {
    const {Article} = (await sequelize()).models;
    return await Article.update(data, {where: {id}});
  }

  async delete(id) {
    const {Article} = (await sequelize()).models;
    return await Article.destroy({where: {id}});
  }
}

module.exports = ArticleService;
