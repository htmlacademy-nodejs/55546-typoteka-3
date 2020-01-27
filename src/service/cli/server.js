'use strict';

const http = require(`http`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const DEFAULT_PORT = 3000;
const FILENAME = `mock.json`;
const EXIT_CODE_ERROR = 1;

module.exports = {
  name: `--server`,
  run(port) {
    http.createServer(async (req, res) => {
      if (req.url === `/`) {
        try {
          const data = JSON.parse((await fs.readFile(FILENAME)).toString());
          res.writeHead(200, {'Content-Type': `text/html; charset=UTF-8`});
          res.end(`<ul>${data.map(({title}) => `<li>${title}</li>`).join(``)}</ul>`);
        } catch (err) {
          console.error(chalk.red(`Ошибка при чтении из файла ${FILENAME}`));
          res.writeHead(404, {'Content-Type': `text/plain; charset=UTF-8`});
          res.end(`Not found`);
          process.exit(EXIT_CODE_ERROR);
        }
      }
    }).listen(+port || DEFAULT_PORT, () => console.log(chalk.green(`server start...`)));
  }
};
