const cluster = require('cluster');
const knex = require('knex');

const env = process.env.NODE_ENV;
const dbConfig = require('../../knexfile')[env];

class Database {
  constructor() {
    this.knex = knex({
      ...dbConfig,
      pool: {
        ...dbConfig.pool,
      },
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
