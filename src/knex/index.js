/* eslint-disable no-param-reassign,no-underscore-dangle */
const cluster = require('cluster');
const knex = require('knex');
const { KnexLogger } = require('./logger');
const { Formatter } = require('../utils');
const logger = require('../winston');

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
    // this.startLog();
    const knexLogger = new KnexLogger(this.knex, {
      logger: logger.info,
    });
  }

  // startLog() {
  //   const queries = [];
  //   this.knex.client.on('start', (builder) => {
  //     const startTime = process.hrtime();
  //     const group = []; // captured for this builder
  //
  //     builder.on('query', (query) => {
  //       group.push({
  //         sql: query.sql,
  //       });
  //     });
  //     builder.on('end', () => {
  //       const diff = process.hrtime(startTime);
  //       const ms = diff[0] * 1e3 + diff[1] * 1e-6;
  //       group.forEach((query) => {
  //         query.duration = ms.toFixed(3);
  //         console.log('query', query);
  //       });
  //     });
  //   });
  // }
}

module.exports = {
  Knex,
};
