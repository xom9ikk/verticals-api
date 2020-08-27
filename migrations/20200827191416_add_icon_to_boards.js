const { tables } = require('../src/database/tables');

const tableName = tables.boards;

exports.up = async (knex) => {
  await knex.schema.table(tableName, (table) => {
    table
      .string('icon')
      .notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.table(tableName, (table) => {
    table
      .dropColumn('icon');
  });
};
