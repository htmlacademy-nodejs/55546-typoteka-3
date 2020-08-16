'use strict';

const chalk = require(`chalk`);
const packageJson = require(`../../../package.json`);

module.exports = {
  name: `--version`,
  run() {
    console.log(chalk.blue(packageJson.version));
  }
};
