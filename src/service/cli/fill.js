'use strict';
const fs = require(`fs`).promises;

const GeneratorHelper = require(`../../generator-helper`);

const chalk = require(`chalk`);
const {getArticleData} = require(`../../utils`);

const EXIT_CODE_ERROR = 1;
const DEFAULT_ARTICLE_COUNT = 3;

const FILE_NAME = `fill-db.sql`;
const MAX_SENTENCES_COUNT = 4;
const MAX_COMMENTS_TEXT_COUNT = 5;

const MAX_ANNOUNCE_COUNT = 4;

const CommentsCount = {
  min: 2,
  max: 10,
};

module.exports = {
  name: `--fill`,
  async run(count) {
    if (count > 1000) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(EXIT_CODE_ERROR);
    }

    const generator = new GeneratorHelper(await getArticleData());

    const user = generator.createUser({
      id: 1,
      name: 'Bob',
      surname: 'Bobertov',
      email: 'bob@mail.ru',
      password: '123456',
      avatar: 'avatar-1.jpg',
    });

    const user2 = generator.createUser({
      id: 2,
      name: 'Rob',
      surname: 'Robertov',
      email: 'rob@mail.ru',
      password: '123456',
      avatar: 'avatar-2.jpg',
    });

    const articleConfig = {
      maxSentencesCount: MAX_SENTENCES_COUNT,
      commentsCount: CommentsCount,
      maxCommentsTextCount: MAX_COMMENTS_TEXT_COUNT,
      maxAnnounceCount: MAX_ANNOUNCE_COUNT,
    };

    const halfArticlesCount = parseInt(DEFAULT_ARTICLE_COUNT / 2, 10);
    const articles = Array.from({length: +(count || DEFAULT_ARTICLE_COUNT)}, (_it, idx) =>
      generator.createArticle((idx > halfArticlesCount ? user2 : user).id, {...articleConfig, id: idx + 1})
    );

    try {
      await fs.writeFile(FILE_NAME, generator.generateSql());
      console.log(chalk.green(`Данные успешно сгенерированы`));
    } catch (err) {
      console.error(chalk.red(`Ошибка при записи моковых данных в файл: ${err}`));
      process.exit(EXIT_CODE_ERROR);
    }
  }
};

