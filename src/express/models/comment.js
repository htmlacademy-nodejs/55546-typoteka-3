'use strict';

module.exports = (sequelize, DataTypes) => {
  class Comment extends sequelize.Sequelize.Model { }
  Comment.init({
    'id': {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      autoIncrementIdentity: true
    },
    'article_id': DataTypes.INTEGER,
    'author_id': DataTypes.INTEGER,
    'text': DataTypes.STRING,
    'date_create': DataTypes.DATE,
  }, {
    sequelize,
    tableName: `comments`,
    timestamps: false
  });

  return Comment;
};
