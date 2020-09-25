require('dotenv').config();
const assert = require('assert');

// User *must* provide these in an .env file
const PORT = process.env.PORT;
const STATIC_DIR = process.env.STATIC_DIR;
const DB_STRING = process.env.DB_STRING;

assert.notStrictEqual(PORT, undefined, 'PORT is undefined! Did you forget to create an .env file?');
assert.notStrictEqual(STATIC_DIR, undefined, 'STATIC_DIR is undefined! Did you forget to create an .env file?');
assert.notStrictEqual(DB_STRING, undefined, 'DB_STRING is undefined! Did you forget to create an .env file?');

const STATUS_CODE = {
  OK: 200,
  BAD_REQUEST: 400,
  INTERNAL_SERVER_ERROR: 500,
};

module.exports = {
  PORT,
  STATIC_DIR,
  DB_STRING,
  STATUS_CODE,
};
