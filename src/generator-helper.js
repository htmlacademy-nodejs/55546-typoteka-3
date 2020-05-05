const {getRandomInt, shuffle} = require(`./utils`);

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

  createUser(config) {
    this.users.push(config);
    return config;
  }

  categoriesInit() {
    this.categories = this.data.categories.map((title, idx) => ({
      id: idx + 1,
      title
    }));
  }

  createArticle(author_id, config) {
    const {titles, sentences} = this.data;

    const article = {
      id: config.id,
      author_id,
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(sentences.slice()).slice(0, getRandomInt(1, config.maxAnnounceCount)).join(` `),
      full_text: shuffle(sentences.slice()).slice(0, getRandomInt(1, sentences.length)).join(` `),
      date_create: Date.now(),
    };

    this.articles.push(article);
    this.addArticleCategories(article.id);
    this.addArticleComments(article.id, author_id, config);

    return article;
  }

  addArticleCategories(article_id) {
    const articleCategories = shuffle(this.categories.slice()).slice(0, getRandomInt(1, this.categories.length - 1))
      .map(({id}, idx) => ({id: idx + this.arcticlesCategory.length + 1, article_id, category_id: id}));

    this.arcticlesCategory = [...this.arcticlesCategory, ...articleCategories];
  }

  addArticleComments(article_id, author_id, config) {
    const articleComments = Array.from({length: getRandomInt(config.commentsCount.min,
          config.commentsCount.max)}, (_it, idx) => ({
      id: idx + this.comments.length + 1,
      author_id,
      article_id,
      text: shuffle(this.data.comments.slice()).slice(0, getRandomInt(1, config.maxCommentsTextCount)).join(` `),
      date_create: Date.now(),
    }));

    this.comments = [...this.comments, ...articleComments];
  }

  createStringSql(table, rows, data) {
    return `INSERT INTO ${table} (${rows}) VALUES\r ${data.map((it, idx, arr) =>
      `\t(${it})${(idx + 1 !== arr.length ? `,` : ';')}\r`).join(``)}\r\r`;
  }

  generateSql() {
    const {categories, users, articles, arcticlesCategory, comments} = this;
    let result = ``;

    result += this.createStringSql(`users`,[`id`, `name`, `surname`, `email`, `password`, `avatar`],
      users.map(({id, name, surname, email, password, avatar}) =>
        [id, `'${name}'`, `'${surname}'`, `'${email}'`, `'${password}'`, `'${avatar}'`]));

    result += this.createStringSql(`categories`, [`id`, `title`],
      categories.map(({id, title, code}) => [id, `'${title}'`]));

    result += this.createStringSql(`articles`, [`id`, `author_id`, `title`, `announce`, `full_text`],
      articles.map(({id, author_id, title, announce, full_text}) =>
        [id, author_id, `'${title}'`, `'${announce}'`, `'${full_text}'`]));

    result += this.createStringSql(`articles_category`, [`id`, `article_id`, `category_id`],
      arcticlesCategory.map(({id, article_id, category_id}) => [id, article_id, category_id]));

    result += this.createStringSql(`comments`, [`id`, `article_id`, `author_id`, `text`],
      comments.map(({id, article_id, author_id, text}) => [id, article_id, author_id, `'${text}'`]));

    return result;
  }
};
