'use strict';

const {literal} = require(`sequelize`);
const sequelize = require(`../db/sequelize`);

const POPULAR_LIMIT = 4;

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
            // [literal(`(SELECT COUNT(*) FROM "articles_category" WHERE "Category"."id" = "articles_category"."category_id")`), `articlesCount`]
          ]
        },
      ]
    })).toJSON();
  }

  async findAll() {
    const {Article} = (await sequelize()).models;
    return (await Article.findAll({include: [`categories`, `comments`]}))
      .map((article) => article.toJSON());
  }

  async findAllByUser(userId) {
    const {Article} = (await sequelize()).models;
    return (await Article.findAll({where: {'author_id': userId}}))
      .map((offer) => offer.toJSON());
  }

  async findPopular() {
    const {Article} = (await sequelize()).models;
    return (await Article.findAll({
      attributes: {
        include: [
          [literal(`(SELECT COUNT(*) FROM comments WHERE comments.article_id = "Article"."id")`), `commentsCount`],
        ]
      },
      include: [`comments`],
      limit: POPULAR_LIMIT,
      order: [literal(`"commentsCount"`)]
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
