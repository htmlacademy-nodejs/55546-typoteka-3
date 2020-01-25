'use strict';

const chalk = require(`chalk`);

module.exports = {
  name: `--version`,
  run() {
    console.log(chalk.blue(require(`../../../package.json`).version));
  }
};
