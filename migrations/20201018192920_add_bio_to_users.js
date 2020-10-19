const { tables } = require('../src/database/tables');

const tableName = tables.users;

exports.up = async (knex) => {
  await knex.schema.table(tableName, (table) => {
    table
      .string('bio');
  });
};

exports.down = async (knex) => {
  await knex.schema.table(tableName, (table) => {
    table
      .dropColumn('bio');
  });
};
