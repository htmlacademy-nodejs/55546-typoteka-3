'use strict';

module.exports = (sequelize, DataTypes) => {
  class ArticleCategory extends sequelize.Sequelize.Model { }
  ArticleCategory.init({
    'id': {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      autoIncrementIdentity: true
    },
    'article_id': DataTypes.INTEGER,
    'category_id': DataTypes.INTEGER,
  }, {
    sequelize,
    tableName: `articles_category`,
    timestamps: false
  });

  return ArticleCategory;
};
