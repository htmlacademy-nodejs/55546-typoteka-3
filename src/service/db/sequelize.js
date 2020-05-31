'use strict';

const config = require(`../../config`);

const {Sequelize} = require(`sequelize`);
const sequelize = new Sequelize(
    config.DB_PGDATABASE,
    config.DB_PGUSER,
    config.DB_PGPASSWORD, {
      dialect: `postgres`,
      host: config.DB_PGHOST,
      port: config.DB_PGPORT,
    });

sequelize.import(`../../express/models/article.js`);
sequelize.import(`../../express/models/article-category.js`);
sequelize.import(`../../express/models/category.js`);
sequelize.import(`../../express/models/comment.js`);
sequelize.import(`../../express/models/user.js`);

const {Article, ArticleCategory, Category, Comment, User} = sequelize.models;

Category.belongsToMany(Article, {
  through: ArticleCategory,
  as: `articles`,
  foreignKey: `category_id`,
});

Article.belongsToMany(Category, {
  through: ArticleCategory,
  as: `categories`,
  foreignKey: `article_id`,
});

Article.hasMany(Comment, {
  as: `comments`,
  foreignKey: `article_id`,
});

Article.hasOne(User, {
  as: `author`,
  sourceKey: `author_id`,
  foreignKey: `id`
});

Comment.hasOne(User, {
  as: `author`,
  sourceKey: `author_id`,
  foreignKey: `id`,
});

Comment.hasOne(Article, {
  as: `article`,
  sourceKey: `article_id`,
  foreignKey: `id`,
});

module.exports = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connection has been established successfully.`);
  } catch (err) {
    console.error(`Unable to connect to the database:`, err);
  }

  return sequelize;
};
