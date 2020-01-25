'use strict';

const chalk = require(`chalk`);
const fs = require(`fs`).promises;
const {getRandomInt, shuffle} = require(`../../utils`);

const EXIT_CODE_ERROR = 1;
const DEFAULT_COUNT = 1;
const FILE_NAME = `mock.json`;
const MAX_ANNOUNCE_COUNT = 4;

const getDataByFile = async (path) => (await fs.readFile(path)).toString().trim().split(`\n`);

module.exports = {
  name: `--generate`,
  async run(count) {
    if (count > 1000) {
      console.error(chalk.green(`Не больше 1000 объявлений`));
      process.exit(EXIT_CODE_ERROR);
    }

    const titles = await getDataByFile(`data/titles.txt`);
    const sentences = await getDataByFile(`data/sentences.txt`);
    const categories = await getDataByFile(`data/categories.txt`);

    const baseDatetime = new Date();
    baseDatetime.setMonth(-3);

    const mockData = Array.from({length: +(count || DEFAULT_COUNT)}, () => ({
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffle(sentences.slice()).slice(0, getRandomInt(1, MAX_ANNOUNCE_COUNT)),
      fullText: shuffle(sentences.slice()).slice(0, getRandomInt(1, sentences.length)),
      createdDate: new Date(getRandomInt(+baseDatetime, Date.now())).toISOString().replace(/T/, ` `).replace(/\..*$/, ``),
      category: shuffle(categories.slice()).slice(0, getRandomInt(1, categories.length - 1)),
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

