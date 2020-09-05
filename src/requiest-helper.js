'use strict';

const logger = require(`./logger`).getLogger();

const MIN_ARTICLE_COMMENT_COUNT = 0;
const MIN_CATEGORY_ARTICLE_COUNT = 0;

module.exports = class RequestHelper {
  constructor(req, res) {
    this.req = req;
    this.res = res;
  }

  getAllCategories(isOnlyWithArticles = false) {
    return this.req.axios.get(`/api/categories`)
      .then((result) => result.data.filter((article) => !isOnlyWithArticles ||
        article.articlesCount > MIN_CATEGORY_ARTICLE_COUNT))
      .catch((error) => {
        logger.error(`Ошибка при получении списка категорий: ${error}`);
        return [];
      });
  }

  getArticleById(articleId, errorRedirect) {
    return this.req.axios.get(`/api/articles/${articleId}`)
      .then((result) => result.data)
      .catch((error) => {
        logger.error(`Ошибка при получении статьи: ${error}`);
        this.res.redirect(errorRedirect);
        return null;
      });
  }

  getPopularArticles() {
    return this.req.axios.get(`/api/articles/popular`)
      .then((result) => result.data.filter((article) => article.commentsCount > MIN_ARTICLE_COMMENT_COUNT))
      .catch((error) => {
        logger.error(`Ошибка при получении списка популярных статей: ${error}`);
        return [];
      });
  }
};
