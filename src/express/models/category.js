'use strict';

const {Model} = require(`sequelize`);

const PATH_CATEGORY_LINK = `/articles/category`;

module.exports = class Category extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      title: DataTypes.STRING,
      link: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${PATH_CATEGORY_LINK}/${this.id}`;
        }
      },
    }, {
      sequelize,
      tableName: `categories`,
      timestamps: false
    });
  }

  static associate({Article, ArticleCategory}) {
    this.belongsToMany(Article, {
      through: ArticleCategory,
      as: `articles`,
      foreignKey: `categoryId`,
    });
  }
};
