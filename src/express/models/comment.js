'use strict';

const moment = require(`moment`);
const {Model} = require(`sequelize`);

const DATE_FORMAT = `DD.MM.YYYY hh:mm`;

const TEXT_MAX_LENGTH = 100;

module.exports = class Comment extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      articleId: DataTypes.INTEGER,
      authorId: DataTypes.INTEGER,
      text: DataTypes.STRING,
      dateCreate: DataTypes.DATE,
      dateCreateCorrectFormat: {
        type: DataTypes.VIRTUAL,
        get() {
          return moment(this.dateCreate).format(DATE_FORMAT);
        }
      },
      limitText: {
        type: DataTypes.VIRTUAL,
        get() {
          const {text} = this;
          return text.length <= TEXT_MAX_LENGTH ? text : `${text.slice(0, TEXT_MAX_LENGTH)}...`;
        }
      },
    }, {
      sequelize,
      tableName: `comments`,
      timestamps: false
    });
  }

  static associate({User, Article}) {
    this.hasOne(User, {
      as: `author`,
      sourceKey: `authorId`,
      foreignKey: `id`,
    });

    this.hasOne(Article, {
      as: `article`,
      sourceKey: `articleId`,
      foreignKey: `id`,
      hooks: true
    });
  }
};
