'use strict';

console.log(`------------------sequelize-START`);

const config = require(`../../config`);
const {Sequelize} = require(`sequelize`);

const Article = require(`../../express/models/article`);
const Category = require(`../../express/models/category`);
const ArticleCategory = require(`../../express/models/article-category`);
const Comment = require(`../../express/models/comment`);
const User = require(`../../express/models/user`);

let sequelize = null;

console.log(`-------------config`, config);

if (config.DATABASE_URL) {
  sequelize = new Sequelize(config.DATABASE_URL, {
    dialect: `postgres`,
    logging: false
  });
} else {
  sequelize = new Sequelize(
      config.DB_PGDATABASE,
      config.DB_PGUSER,
      config.DB_PGPASSWORD, {
        dialect: `postgres`,
        host: config.DB_PGHOST,
        port: config.DB_PGPORT,
        logging: false
      });
}

// const sequelize = new Sequelize(
//     config.DB_PGDATABASE,
//     config.DB_PGUSER,
//     config.DB_PGPASSWORD, {
//       dialect: `postgres`,
//       host: config.DB_PGHOST,
//       port: config.DB_PGPORT,
//       logging: false
//     });

const models = {
  Article: Article.init(sequelize, Sequelize),
  ArticleCategory: ArticleCategory.init(sequelize, Sequelize),
  Category: Category.init(sequelize, Sequelize),
  Comment: Comment.init(sequelize, Sequelize),
  User: User.init(sequelize, Sequelize),
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === `function`) {
    model.associate(models);
  }
});

module.exports = async () => {
  try {
    await sequelize.authenticate();
  } catch (err) {
    console.error(`Unable to connect to the database:`, err);
  }

  return sequelize;
};
