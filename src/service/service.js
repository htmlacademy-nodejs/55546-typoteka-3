'use strict';

const {Cli} = require(`./cli`);

const DEFAULT_COMMAND = `--version`;
const USER_ARGV_INDEX = 2;

const userArguments = process.argv.slice(USER_ARGV_INDEX);
const [userCommand, commandValue] = userArguments;

if (Cli[userCommand]) {
  Cli[userCommand].run(commandValue);
} else {
  Cli[DEFAULT_COMMAND].run();
}
