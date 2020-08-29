'use strict';

const fs = require(`fs`).promises;
const GeneratorHelper = require(`../../generator-helper`);
const chalk = require(`chalk`);
const {getArticleData} = require(`../../utils`);
const bcrypt = require(`bcrypt`);
const {PASSWORD_SALT, ADMIN_ID} = require(`../../const`);

const EXIT_CODE_ERROR = 1;
const DEFAULT_ARTICLE_COUNT = 3;
const MAX_ARTICLES_COUNT = 1000;
const FILE_NAME = `fill-db.sql`;
const MAX_SENTENCES_COUNT = 4;
const MAX_COMMENTS_TEXT_COUNT = 5;
const MAX_ANNOUNCE_COUNT = 4;
const DEFAULT_USER_PASSWORD = `123456`;
const DEFAULT_USER_HASH_PASSWORD = `$2b$10$fTE8wdkBsEFCTbJFNHev4eZ7QVgRnh9gpq.h.ApRbRBzCCUnqrz/6`;
const ARTICLE_INDEX_OFFSET = 1;

const CommentsCount = {
  MIN: 2,
  MAX: 10,
};

module.exports = {
  name: `--fill`,
  async run(count) {
    if (count > MAX_ARTICLES_COUNT) {
      console.error(chalk.red(`Не больше 1000 объявлений`));
      process.exit(EXIT_CODE_ERROR);
    }

    const generator = new GeneratorHelper(await getArticleData());
    const hashPassword = await bcrypt.hash(DEFAULT_USER_PASSWORD, PASSWORD_SALT)
      .catch((error) => {
        console.log(`При генерации хэша пароля возникла ошибка: ${error}.\n
        Будет использован заранее созданный хэш пароля по умолчанию - ${DEFAULT_USER_PASSWORD}.`);
        return DEFAULT_USER_HASH_PASSWORD;
      });

    generator.createUser({
      id: 1,
      name: `Admin`,
      surname: `Adminov`,
      email: `admin@mail.ru`,
      password: hashPassword,
      // avatar: `admin-1.jpg`,
    });

    generator.createUser({
      id: 2,
      name: `Rob`,
      surname: `Robertov`,
      email: `rob@mail.ru`,
      password: hashPassword,
      // avatar: `avatar-2.jpg`,
    });

    const articleConfig = {
      maxSentencesCount: MAX_SENTENCES_COUNT,
      commentsCount: CommentsCount,
      maxCommentsTextCount: MAX_COMMENTS_TEXT_COUNT,
      maxAnnounceCount: MAX_ANNOUNCE_COUNT,
    };

    Array.from({length: +(count || DEFAULT_ARTICLE_COUNT)}, (_it, idx) =>
      generator.createArticle(ADMIN_ID, {...articleConfig, id: idx + ARTICLE_INDEX_OFFSET}));

    try {
      await fs.writeFile(FILE_NAME, generator.generateSql());
      console.log(chalk.green(`Данные успешно сгенерированы`));
    } catch (err) {
      console.error(chalk.red(`Ошибка при записи моковых данных в файл: ${err}`));
      process.exit(EXIT_CODE_ERROR);
    }
  }
};

