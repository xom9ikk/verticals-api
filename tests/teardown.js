const { Knex } = require('../src/knex');

module.exports = async () => {
  const knexConnection = new Knex();
  // await knexConnection.migrate.rollback({}, true);
  await knexConnection.destroy();
};
