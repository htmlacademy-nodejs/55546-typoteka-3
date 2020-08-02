'use strict';

const moment = require(`moment`);
const {getRandomInt, shuffle} = require(`./utils`);

const MONTH_DIFFERENCE = 3;

module.exports = class GeneratorHelper {
  constructor(data) {
    this.data = data;

    this.categories = [];
    this.users = [];
    this.articles = [];
    this.comments = [];

    this.arcticlesCategory = [];

    this.categoriesInit();
  }

  getRandomDate() {
    const baseDatetime = new Date();
    baseDatetime.setMonth(MONTH_DIFFERENCE);
    return moment(getRandomInt(+baseDatetime, Date.now())).format(`YYYY.MM.DD. hh:mm:ss`);
  }

  createUser(config) {
    this.users.push({...config, id: config.id || `DEFAULT`});
    return config;
  }

  categoriesInit() {
    this.categories = this.data.categories.map((title, idx) => ({id: idx + 1, title}));
  }

  createArticle(authorId, config) {
    const {titles, sentences} = this.data;

    const article = {
      'id': config.id || `DEFAULT`,
      'author_id': authorId,
      'title': titles[getRandomInt(0, titles.length - 1)],
      'announce': shuffle(sentences.slice()).slice(0, getRandomInt(1, config.maxAnnounceCount)).join(` `),
      'full_text': shuffle(sentences.slice()).slice(0, getRandomInt(1, sentences.length)).join(` `),
      'date_create': this.getRandomDate(),
    };

    this.articles.push(article);
    this.addArticleCategories(article.id);
    this.addArticleComments(article.id, authorId, config);

    return article;
  }

  addArticleCategories(articleId) {
    const articleCategories = shuffle(this.categories.slice()).slice(0, getRandomInt(1, this.categories.length - 1))
      .map(({id}) => ({'id': `DEFAULT`, 'article_id': articleId, 'category_id': id}));

    this.arcticlesCategory = [...this.arcticlesCategory, ...articleCategories];
  }

  addArticleComments(articleId, authorId, config) {
    const articleComments = Array.from({length: getRandomInt(config.commentsCount.min,
        config.commentsCount.max)}, () => ({
      'id': `DEFAULT`,
      'author_id': authorId,
      'article_id': articleId,
      'text': shuffle(this.data.comments.slice()).slice(0, getRandomInt(1, config.maxCommentsTextCount)).join(` `),
      'date_create': this.getRandomDate(),
    }));

    this.comments = [...this.comments, ...articleComments];
  }

  createStringSql(table, rows, data) {
    return `INSERT INTO ${table} (${rows}) VALUES\r ${data.map((it, idx, arr) =>
      `\t(${it})${(idx + 1 !== arr.length ? `,` : `;`)}\r`).join(``)}\r\r`;
  }

  generateSql() {
    const {categories, users, articles, arcticlesCategory, comments} = this;
    let result = ``;

    result += this.createStringSql(`users`, [`id`, `name`, `surname`, `email`, `password`, `avatar`],
        users.map(({id, name, surname, email, password, avatar}) =>
          [id, `'${name}'`, `'${surname}'`, `'${email}'`, `'${password}'`, `'${avatar}'`]));

    result += this.createStringSql(`categories`, [`id`, `title`],
        categories.map(({id, title}) => [id, `'${title}'`]));
    result += this.createStringSql(`articles`, [`id`, `author_id`, `title`, `announce`, `full_text`, `date_create`],
        articles.map((it) =>
          [it.id, it[`author_id`], `'${it.title}'`, `'${it.announce}'`, `'${it[`full_text`]}'`, `'${it[`date_create`]}'`]));

    result += this.createStringSql(`articles_category`, [`id`, `article_id`, `category_id`],
        arcticlesCategory.map((it) => [it.id, it[`article_id`], it[`category_id`]]));

    result += this.createStringSql(`comments`, [`id`, `article_id`, `author_id`, `text`, `date_create`],
        comments.map((it) => [it.id, it[`article_id`], it[`author_id`], `'${it.text}'`, `'${it[`date_create`]}'`]));

    return result;
  }
};
