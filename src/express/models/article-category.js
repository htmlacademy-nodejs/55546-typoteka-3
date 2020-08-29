'use strict';

const {Model} = require(`sequelize`);

module.exports = class ArticleCategory extends Model {
  static init(sequelize, DataTypes) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity: true
      },
      articleId: DataTypes.INTEGER,
      categoryId: DataTypes.INTEGER,
    }, {
      sequelize,
      tableName: `articles_category`,
      timestamps: false
    });
  }
};
