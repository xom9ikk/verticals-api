module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
  },
  extends: [
    'airbnb-base',
  ],
  plugins: [
    'jest',
  ],
  rules: {
    radix: 0,
    'class-methods-use-this': 0,
    'consistent-return': 0,
    'no-async-promise-executor': 0,
  },
  globals: {
    knex: true,
    logger: true,
    wss: true,
  },
  env: {
    node: true,
    'jest/globals': true,
  },
};
