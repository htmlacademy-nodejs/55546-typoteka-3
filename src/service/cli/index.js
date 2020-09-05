'use strict';

const fill = require(`./fill`);
const generate = require(`./generate`);
const help = require(`./help`);
const version = require(`./version`);
const server = require(`./server`);

// const Cli = {
//   [fill.name]: fill,
//   [generate.name]: generate,
//   [help.name]: help,
//   [version.name]: version,
//   [server.name]: server,
// };

// module.exports = {
//   Cli,
// };

module.exports.Cli = {
  [fill.name]: fill,
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
};
