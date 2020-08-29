'use strict';

const {getRandomInt, shuffle, getRandomDate} = require(`./utils`);

const MONTH_DIFFERENCE = 3;
const ITEM_DEFAULT_ID = `DEFAULT`;
const MIN_ITEM_COUNT = 1;
const INDEX_OFFSET = 1;

module.exports = class GeneratorHelper {
  constructor(data) {
    this.data = data;

    this.sqlData = [];

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

  createArticle(authorId, config) {
    const {titles, sentences} = this.data;

    const article = {
      id: config.id || ITEM_DEFAULT_ID,
      authorId,
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(sentences.slice()).slice(0, getRandomInt(MIN_ITEM_COUNT, config.maxAnnounceCount)).join(` `),
      fullText: shuffle(sentences.slice()).slice(0, getRandomInt(MIN_ITEM_COUNT, sentences.length)).join(` `),
      dateCreate: getRandomDate(MONTH_DIFFERENCE),
    };

    this.articles.push(article);
    this._addArticleCategories(article.id);
    this._addArticleComments(article.id, authorId, config);

    return article;
  }

  generateSql() {
    const {categories, users, articles, arcticlesCategory, comments} = this;

    this._addSqlInsert(`users`, [`id`, `name`, `surname`, `email`, `password`],
        users.map(({id, name, surname, email, password}) =>
          [id, `'${name}'`, `'${surname}'`, `'${email}'`, `'${password}'`]));
    this._addSqlSetval(`public.users_id_seq`, users[users.length - 1].id);

    this._addSqlInsert(`categories`, [`id`, `title`],
        categories.map(({id, title}) => [id, `'${title}'`]));
    this._addSqlSetval(`public.categories_id_seq`, categories[categories.length - 1].id);

    this._addSqlInsert(`articles`, [`id`, `authorId`, `title`, `announce`, `fullText`, `dateCreate`],
        articles.map((it) =>
          [it.id, it.authorId, `'${it.title}'`, `'${it.announce}'`, `'${it.fullText}'`, `'${it.dateCreate}'`]));
    this._addSqlSetval(`public.articles_id_seq`, articles[articles.length - 1].id);

    this._addSqlInsert(`articles_category`, [`id`, `articleId`, `categoryId`],
        arcticlesCategory.map((it) => [it.id, it.articleId, it.categoryId]));

    this._addSqlInsert(`comments`, [`id`, `articleId`, `authorId`, `text`, `dateCreate`],
        comments.map((it) => [it.id, it.articleId, it.authorId, `'${it.text}'`, `'${it.dateCreate}'`]));

    return this.sqlData.join(``);
  }

  _categoriesInit() {
    this.categories = this.data.categories.map((title, idx) => ({id: idx + INDEX_OFFSET, title}));
  }

  _addSqlInsert(table, rows, data) {
    this.sqlData.push(`INSERT INTO ${table} (${rows.map((row) => `"${row}"`)}) VALUES\r ${data.map((it, idx, arr) =>
      `\t(${it})${(idx + INDEX_OFFSET < arr.length ? `,` : `;`)}\r`).join(``)}\r\r`);
  }

  _addSqlSetval(name, index) {
    this.sqlData.push(`SELECT setval('${name}', ${index}, true);\r\r\r`);
  }

  _addArticleCategories(articleId) {
    const articleCategories = shuffle(this.categories.slice())
      .slice(0, getRandomInt(MIN_ITEM_COUNT, this.categories.length - 1))
      .map(({id}) => ({id: ITEM_DEFAULT_ID, articleId, categoryId: id}));

    this.arcticlesCategory = [...this.arcticlesCategory, ...articleCategories];
  }

  _addArticleComments(articleId, authorId, config) {
    const articleComments = Array.from({length: getRandomInt(config.commentsCount.MIN,
        config.commentsCount.MAX)}, () => ({
      id: ITEM_DEFAULT_ID,
      authorId,
      articleId,
      text: shuffle(this.data.comments.slice()).slice(0, getRandomInt(MIN_ITEM_COUNT, config.maxCommentsTextCount)).join(` `),
      dateCreate: getRandomDate(MONTH_DIFFERENCE),
    }));

    this.comments = [...this.comments, ...articleComments];
  }
};
