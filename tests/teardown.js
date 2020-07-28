const { Knex } = require('../src/knex');

module.exports = async () => {
  const knexConnection = new Knex();
  await knexConnection.raw(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
  `);
  await knexConnection.closeConnection();
};
