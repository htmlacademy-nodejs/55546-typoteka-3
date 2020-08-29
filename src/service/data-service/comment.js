'use strict';

const {literal} = require(`sequelize`);
const sequelize = require(`../db/sequelize`);
const {wrapperDataService} = require(`../../utils`);

const LAST_LIMIT = 4;

class CommentService {
  static findOne(id) {
    return wrapperDataService(async () => {
      const {Comment} = (await sequelize()).models;
      return await Comment.findOne({
        where: {id},
        include: [`author`, `article`],
      });
    }, `Ошибка при получении конкретного комментария`, []);
  }

  static findAll() {
    return wrapperDataService(async () => {
      const {Comment} = (await sequelize()).models;
      return (await Comment.findAll({
        include: [`author`, `article`],
        order: [[literal(`"dateCreate"`), `DESC`]]
      })).map((comment) => comment.toJSON());
    }, `Ошибка при получении списка всех комментариев`, []);
  }

  static findLast() {
    return wrapperDataService(async () => {
      const {Comment} = (await sequelize()).models;
      return (await Comment.findAll({
        include: [`author`, `article`],
        limit: LAST_LIMIT,
        order: [[literal(`"dateCreate"`), `DESC`]]
      })).map((comment) => comment.toJSON());
    }, `Ошибка при получении списка последних комментариев`, []);
  }

  static create(data) {
    return wrapperDataService(async () => {
      const {Comment} = (await sequelize()).models;
      return await Comment.create(data);
    }, `Ошибка при создании нового комментария`, null);
  }

  static delete(id) {
    return wrapperDataService(async () => {
      const {Comment} = (await sequelize()).models;
      return await Comment.destroy({where: {id}});
    }, `Ошибка при удалении комментария`, null);
  }
}

module.exports = CommentService;
