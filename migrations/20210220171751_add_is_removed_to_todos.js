const { tables } = require('../src/database/tables');

const tableName = tables.todos;

exports.up = async (knex) => {
  await knex.schema.table(tableName, (table) => {
    table
      .boolean('is_removed')
      .defaultTo(false);
  });
};

exports.down = async (knex) => {
  await knex.schema.table(tableName, (table) => {
    table
      .dropColumn('is_removed');
  });
};
