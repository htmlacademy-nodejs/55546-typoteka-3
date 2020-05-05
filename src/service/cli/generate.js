'use strict';

const chalk = require(`chalk`);
const nanoid = require(`nanoid`);
const fs = require(`fs`).promises;
const {getRandomInt, shuffle, getArticleData} = require(`../../utils`);

const EXIT_CODE_ERROR = 1;
const DEFAULT_COUNT = 1;
const FILE_NAME = `mock.json`;
const MAX_ANNOUNCE_COUNT = 4;
const MAX_COMMENTS_COUNT = 10;
const MAX_COMMENTS_TEXT_COUNT = 5;

module.exports = {
  name: `--generate`,
  async run(count) {
    if (count > 1000) {
      console.error(chalk.green(`Не больше 1000 объявлений`));
      process.exit(EXIT_CODE_ERROR);
    }

    const {titles, sentences, categories, comments} = await getArticleData();

    const baseDatetime = new Date();
    baseDatetime.setMonth(-3);

    const mockData = Array.from({length: +(count || DEFAULT_COUNT)}, () => ({
      id: nanoid(),
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(sentences.slice()).slice(0, getRandomInt(1, MAX_ANNOUNCE_COUNT)),
      fullText: shuffle(sentences.slice()).slice(0, getRandomInt(1, sentences.length)).join(` `),
      createdDate: new Date(getRandomInt(+baseDatetime, Date.now())).toISOString().replace(/T/, ` `).replace(/\..*$/, ``),
      category: shuffle(categories.slice()).slice(0, getRandomInt(1, categories.length - 1)),
      comments: Array.from({length: getRandomInt(1, MAX_COMMENTS_COUNT)}, () => {
        return {
          id: nanoid(),
          text: shuffle(comments.slice()).slice(0, getRandomInt(1, MAX_COMMENTS_TEXT_COUNT)).join(` `)
        };
      })
    }));

    try {
      await fs.writeFile(FILE_NAME, JSON.stringify(mockData));
      console.log(chalk.green(`Данные успешно сгенерированы`));
    } catch (err) {
      console.error(chalk.red(`Ошибка при записи моковых данных в файл`));
      process.exit(EXIT_CODE_ERROR);
    }
  }
};

