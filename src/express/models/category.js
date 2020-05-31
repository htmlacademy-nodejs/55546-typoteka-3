'use strict';

module.exports = (sequelize, DataTypes) => {
  class Category extends sequelize.Sequelize.Model { }
  Category.init({
    'id': {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    'title': DataTypes.STRING,
  }, {
    sequelize,
    tableName: `categories`,
    timestamps: false
  });

  return Category;
};
