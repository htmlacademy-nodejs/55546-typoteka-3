'use strict';

module.exports = {
  name: `--version`,
  run() {
    console.log(require(`../../../package.json`).version);
  }
};
