'use strict';

const {literal} = require(`sequelize`);
const sequelize = require(`../db/sequelize`);

const LAST_LIMIT = 3;
const LAST_PERSONAL_LIMIT = 9;

class CommentService {
  async findOne(id) {
    const {Comment} = (await sequelize()).models;
    return (await Comment.findByPk(id, {include: [`categories`]})).toJSON();
  }

  async findAll() {
    const {Comment} = (await sequelize()).models;
    return (await Comment.findAll({
      include: [`author`, `article`],
      order: [[literal(`"date_create"`), `DESC`]]
    })).map((comment) => comment.toJSON());
  }

  async findAllByArticleId(id) {
    const {Comment} = (await sequelize()).models;
    return (await Comment.findAll({where: {'article_id': +id}}))
      .map((comment) => comment.toJSON());
  }

  async findLast() {
    const {Comment} = (await sequelize()).models;
    return (await Comment.findAll({
      include: [`author`, `article`],
      limit: LAST_LIMIT,
      order: [[literal(`"date_create"`), `DESC`]]
    })).map((comment) => comment.toJSON());
  }

  async findLastByUser() {
    const {Comment} = (await sequelize()).models;
    return (await Comment.findAll({
      include: [`author`, `article`],
      limit: LAST_PERSONAL_LIMIT,
      order: [[literal(`"date_create"`), `DESC`]]
    })).map((comment) => comment.toJSON());
  }

  async checkIsAuthor(commentId, userId) {
    const {Comment} = (await sequelize()).models;
    return (await Comment.findOne({
      where: {
        [`id`]: commentId,
        [`author_id`]: userId,
      },
    })) ? true : false;
  }

  async create(data) {
    const {Comment} = (await sequelize()).models;
    return await Comment.create(data);
  }

  async update(id, data) {
    const {Comment} = (await sequelize()).models;
    return await Comment.update(data, {where: {id}});
  }

  async delete(id) {
    const {Comment} = (await sequelize()).models;
    return await Comment.destroy({where: {id}});
  }
}

module.exports = CommentService;
