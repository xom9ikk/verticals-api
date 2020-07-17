const cluster = require('cluster');
const knex = require('knex');

const env = process.env.NODE_ENV || 'development';
const dbConfig = require('../../knexfile')[env];

class Database {
  constructor() {
    this.knex = knex({
      ...dbConfig,
      pool: {
        ...dbConfig.pool,
        // afterCreate: (connection, callback) => {
        //   connection.query('SET timezone to \'UTC\'', (err) => {
        //     const { host, port } = dbConfig.connection;
        //     // console.log(`PostgreSQL connection established by ${host}:${port}`);
        //     callback(err, connection);
        //   });
        // },
      },
    });
    this.knex.migrate.latest();
    // if (cluster.isMaster) {
    //   console.log('Migrate DB');
    //   if (env === 'development') {
    //     // Drop tables tokens & users
    //     // this.knex.seed.run();
    //   }
    // }
  }
}

module.exports = Database;
