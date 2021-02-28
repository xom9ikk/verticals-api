const { tables } = require('../src/database/tables');

const tableName = tables.columns;

exports.up = async (knex) => {
  await knex.schema.table(tableName, (table) => {
    table
      .integer('width');
  });
};

exports.down = async (knex) => {
  await knex.schema.table(tableName, (table) => {
    table
      .dropColumn('width');
  });
};
