'use strict';

module.exports = {
  name: `--server`,
  run(port) {
    require(`../../express`)(port);
  }
};
