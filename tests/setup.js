require('dotenv').config({ path: './tests/.env.test' });

const { Knex } = require('../src/knex');
const { FileComponent } = require('../src/components/file');

module.exports = async () => {
  const knexConnection = new Knex();
  await knexConnection.migrate.rollback({}, true);
  await knexConnection.migrate.latest();
  await knexConnection.closeConnection();
  FileComponent.createFolders();
};
