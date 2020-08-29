'use strict';

const moment = require(`moment`);

const {Model} = require(`sequelize`);
const {ARTICLE_UPLOADED_PATH} = require(`../../const`);

const PATH_ARTICLE_LINK = `/articles`;
const DATE_FORMAT = `DD.MM.YYYY hh:mm`;
const ANNOUNCE_MAX_LENGTH = 100;

module.exports = class Article extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      authorId: DataTypes.INTEGER,
      title: DataTypes.STRING,
      img: DataTypes.STRING,
      announce: DataTypes.STRING,
      fullText: DataTypes.STRING,
      dateCreate: DataTypes.DATE,
      limitAnnounce: {
        type: DataTypes.VIRTUAL,
        get() {
          const {announce} = this;
          return announce.length <= ANNOUNCE_MAX_LENGTH ? announce : `${announce.slice(0, ANNOUNCE_MAX_LENGTH)}...`;
        }
      },
      dateCreateCorrectFormat: {
        type: DataTypes.VIRTUAL,
        get() {
          return moment(this.dateCreate).format(DATE_FORMAT);
        }
      },
      imgPath: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${ARTICLE_UPLOADED_PATH}/${this.img}`;
        }
      },
      link: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${PATH_ARTICLE_LINK}/${this.id}`;
        }
      },
    }, {
      sequelize,
      tableName: `articles`,
      timestamps: false,
    });
  }

  static associate({Category, ArticleCategory, Comment, User}) {
    this.belongsToMany(Category, {
      through: ArticleCategory,
      as: `categories`,
      foreignKey: `articleId`,
    });

    this.hasMany(Comment, {
      as: `comments`,
      foreignKey: `articleId`,
      hooks: true
    });

    this.hasOne(User, {
      as: `author`,
      sourceKey: `authorId`,
      foreignKey: `id`
    });
  }
};
