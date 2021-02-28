const { tables } = require('../src/database/tables');

const tableName = tables.todos;

exports.up = async (knex) => {
  await knex.schema.table(tableName, (table) => {
    table
      .date('expiration_date');
  });
};

exports.down = async (knex) => {
  await knex.schema.table(tableName, (table) => {
    table
      .dropColumn('expiration_date');
  });
};
