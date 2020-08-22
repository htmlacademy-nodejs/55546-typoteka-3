'use strict';

const {literal} = require(`sequelize`);
const sequelize = require(`../db/sequelize`);

const LAST_LIMIT = 4;

class CommentService {
  static async findOne(id) {
    const {Comment} = (await sequelize()).models;
    return (await Comment.findByPk(id, {include: [`author`, `article`]})).toJSON();
  }

  static async findAll() {
    const {Comment} = (await sequelize()).models;
    return (await Comment.findAll({
      include: [`author`, `article`],
      order: [[literal(`"date_create"`), `DESC`]]
    })).map((comment) => comment.toJSON());
  }

  static async findLast() {
    const {Comment} = (await sequelize()).models;
    return (await Comment.findAll({
      include: [`author`, `article`],
      limit: LAST_LIMIT,
      order: [[literal(`"date_create"`), `DESC`]]
    })).map((comment) => comment.toJSON());
  }

  static async create(data) {
    const {Comment} = (await sequelize()).models;
    return await Comment.create(data);
  }

  static async delete(id) {
    const {Comment} = (await sequelize()).models;
    return await Comment.destroy({where: {id}});
  }
}

module.exports = CommentService;
