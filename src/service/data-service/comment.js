'use strict';

const {literal} = require(`sequelize`);
const sequelize = require(`../db/sequelize`);

const LAST_LIMIT = 4;

class CommentService {
  async findOne(id) {
    const {Comment} = (await sequelize()).models;
    return (await Comment.findByPk(id, {include: [`author`, `article`]})).toJSON();
  }

  async findAll() {
    const {Comment} = (await sequelize()).models;
    return (await Comment.findAll({
      include: [`author`, `article`],
      order: [[literal(`"date_create"`), `DESC`]]
    })).map((comment) => comment.toJSON());
  }

  async findLast() {
    const {Comment} = (await sequelize()).models;
    return (await Comment.findAll({
      include: [`author`, `article`],
      limit: LAST_LIMIT,
      order: [[literal(`"date_create"`), `DESC`]]
    })).map((comment) => comment.toJSON());
  }

  async create(data) {
    const {Comment} = (await sequelize()).models;
    return await Comment.create(data);
  }

  async delete(id) {
    const {Comment} = (await sequelize()).models;
    return await Comment.destroy({where: {id}});
  }
}

module.exports = CommentService;
