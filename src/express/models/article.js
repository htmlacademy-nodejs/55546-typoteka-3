'use strict';

module.exports = (sequelize, DataTypes) => {
  class Article extends sequelize.Sequelize.Model { }
  Article.init({
    'id': {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      autoIncrementIdentity: true
    },
    'author_id': DataTypes.INTEGER,
    'title': DataTypes.STRING,
    'img': DataTypes.STRING,
    'announce': DataTypes.STRING,
    'full_text': DataTypes.STRING,
    'date_create': DataTypes.DATE,
  }, {
    sequelize,
    tableName: `articles`,
    timestamps: false
  });

  return Article;
};
