'use strict';

const dotenv = require(`dotenv`);
const result = dotenv.config();

module.exports = Object.assign({}, result.error ? {} : result.parsed);

// if (result.error) {
//   throw result.error;
// }

// module.exports = Object.assign({}, result.parsed);
