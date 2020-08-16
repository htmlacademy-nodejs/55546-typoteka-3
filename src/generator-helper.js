'use strict';

const moment = require(`moment`);
const {getRandomInt, shuffle} = require(`./utils`);

const MONTH_DIFFERENCE = 3;
const ITEM_DEFAULT_ID = `DEFAULT`;

const getRandomDate = () => {
  const baseDatetime = new Date();
  baseDatetime.setMonth(MONTH_DIFFERENCE);
  return moment(getRandomInt(+baseDatetime, +Date.now())).format(`YYYY.MM.DD. hh:mm:ss`);
};

module.exports = class GeneratorHelper {
  constructor(data) {
    this.data = data;

    this.sqlString = [];

    this.categories = [];
    this.users = [];
    this.articles = [];
    this.comments = [];

    this.arcticlesCategory = [];

    this._categoriesInit();
  }

  createUser(config) {
    this.users.push({...config, id: config.id || ITEM_DEFAULT_ID});
    return config;
  }

  _categoriesInit() {
    this.categories = this.data.categories.map((title, idx) => ({id: idx + 1, title}));
  }

  createArticle(authorId, config) {
    const {titles, sentences} = this.data;

    const article = {
      'id': config.id || ITEM_DEFAULT_ID,
      'author_id': authorId,
      'title': titles[getRandomInt(0, titles.length - 1)],
      'announce': shuffle(sentences.slice()).slice(0, getRandomInt(1, config.maxAnnounceCount)).join(` `),
      'full_text': shuffle(sentences.slice()).slice(0, getRandomInt(1, sentences.length)).join(` `),
      'date_create': getRandomDate(),
    };

    this.articles.push(article);
    this._addArticleCategories(article.id);
    this._addArticleComments(article.id, authorId, config);

    return article;
  }

  _addArticleCategories(articleId) {
    const articleCategories = shuffle(this.categories.slice()).slice(0, getRandomInt(1, this.categories.length - 1))
      .map(({id}) => ({'id': ITEM_DEFAULT_ID, 'article_id': articleId, 'category_id': id}));

    this.arcticlesCategory = [...this.arcticlesCategory, ...articleCategories];
  }

  _addArticleComments(articleId, authorId, config) {
    const articleComments = Array.from({length: getRandomInt(config.commentsCount.min,
        config.commentsCount.max)}, () => ({
      'id': ITEM_DEFAULT_ID,
      'author_id': authorId,
      'article_id': articleId,
      'text': shuffle(this.data.comments.slice()).slice(0, getRandomInt(1, config.maxCommentsTextCount)).join(` `),
      'date_create': getRandomDate(),
    }));

    this.comments = [...this.comments, ...articleComments];
  }

  _addSqlInsert(table, rows, data) {
    this.sqlString.push(`INSERT INTO ${table} (${rows}) VALUES\r ${data.map((it, idx, arr) =>
      `\t(${it})${(idx + 1 !== arr.length ? `,` : `;`)}\r`).join(``)}\r\r`);
  }

  _addSqlSetval(name, index) {
    this.sqlString.push(`SELECT setval('${name}', ${index}, true);\r\r\r`);
  }

  generateSql() {
    const {categories, users, articles, arcticlesCategory, comments} = this;

    this._addSqlInsert(`users`, [`id`, `name`, `surname`, `email`, `password`, `avatar`],
        users.map(({id, name, surname, email, password, avatar}) =>
          [id, `'${name}'`, `'${surname}'`, `'${email}'`, `'${password}'`, `'${avatar}'`]));
    this._addSqlSetval(`public.users_id_seq`, users[users.length - 1].id);

    this._addSqlInsert(`categories`, [`id`, `title`],
        categories.map(({id, title}) => [id, `'${title}'`]));
    this._addSqlSetval(`public.categories_id_seq`, categories[categories.length - 1].id);

    this._addSqlInsert(`articles`, [`id`, `author_id`, `title`, `announce`, `full_text`, `date_create`],
        articles.map((it) =>
          [it.id, it[`author_id`], `'${it.title}'`, `'${it.announce}'`, `'${it[`full_text`]}'`, `'${it[`date_create`]}'`]));
    this._addSqlSetval(`public.articles_id_seq`, articles[articles.length - 1].id);

    this._addSqlInsert(`articles_category`, [`id`, `article_id`, `category_id`],
        arcticlesCategory.map((it) => [it.id, it[`article_id`], it[`category_id`]]));

    this._addSqlInsert(`comments`, [`id`, `article_id`, `author_id`, `text`, `date_create`],
        comments.map((it) => [it.id, it[`article_id`], it[`author_id`], `'${it.text}'`, `'${it[`date_create`]}'`]));

    return this.sqlString.join(``);
  }
};
