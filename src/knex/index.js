const cluster = require('cluster');
const knex = require('knex');
const { Formatter } = require('../utils');

const {
  NODE_ENV,
  NODE_APP_INSTANCE,
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
    // console.log('migrate:latest');
    // this.knex.migrate.latest();
    if (cluster.isMaster || NODE_APP_INSTANCE === '0') {
      // console.log('seed:run');
      // Drop tables
      // this.knex.seed.run();
    }
  }
}

module.exports = {
  Knex,
};
