'use strict';

const dotenv = require(`dotenv`);
const result = dotenv.config();

module.exports = Object.assign({}, result.error ? process.env : result.parsed);

// if (result.error) {
//   throw result.error;
// }

// module.exports = Object.assign({}, result.parsed);
