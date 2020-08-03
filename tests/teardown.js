const fs = require('fs');
const path = require('path');
const { Knex } = require('../src/knex');

const removeUploads = () => new Promise((resolve) => {
  const pathToTestUploads = path.resolve('uploads_test');
  fs.rmdir(pathToTestUploads, { recursive: true }, resolve);
});

module.exports = async () => {
  const knexConnection = new Knex();
  await knexConnection.destroy();
  await removeUploads();
};
