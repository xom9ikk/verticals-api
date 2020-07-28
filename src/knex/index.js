const knex = require('knex');
const { Formatter } = require('../utils');
const { KnexLogger } = require('../logger/knex');

const {
  NODE_ENV,
} = process.env;
const dbConfig = require('../../knexfile')[NODE_ENV];

class Knex {
  constructor() {
    this.knex = knex({
      ...dbConfig,
      pool: {
        ...dbConfig.pool,
      },
      postProcessResponse: (result) => Formatter.deepConvertToCamelCase(result),
      wrapIdentifier: (value, origImpl) => (
        value === '*'
          ? value
          : origImpl(Formatter.convertToSnakeCase(value))),
    });
    // if (global.logger) {
    //   this.logger = new KnexLogger(this.knex, {
    //     logger: logger.database,
    //   });
    // }
    this.knex.closeConnection = () => new Promise((resolve) => {
      console.log('close connection');
      this
        .knex
        .destroy()
        .catch(() => {
          console.log('eerrr');
        })
        .finally(resolve);
    });
    return this.knex;
  }
}

module.exports = {
  Knex,
};
