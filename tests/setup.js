const { Knex } = require('../src/knex');

module.exports = async () => {
  const knexConnection = new Knex().knex;
  await knexConnection.migrate.rollback({}, true);
  await knexConnection.migrate.latest();
  await knexConnection.destroy();
};
