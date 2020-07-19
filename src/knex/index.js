const cluster = require('cluster');
const knex = require('knex');
const { Formatter } = require('../utils');

const env = process.env.NODE_ENV;
const dbConfig = require('../../knexfile')[env];

class Knex {
  constructor() {
    this.knex = knex({
      ...dbConfig,
      pool: {
        ...dbConfig.pool,
      },
      postProcessResponse: (result) => Formatter.deepConvertToCamelCase(result),
      wrapIdentifier: (value, origImpl) => (value === '*' ? value : origImpl(Formatter.convertToSnakeCase(value))),
    });
    this.knex.migrate.latest();
    if (cluster.isMaster) {
      console.log('migrate:latest');
      // Drop tables
      // this.knex.seed.run();
    }
  }
}

module.exports = Database;
