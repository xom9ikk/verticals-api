const { tables } = require('../src/database/tables');

const tableName = tables.boards;

exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table
      .increments('id')
      .primary();
    table
      .string('title')
      .notNullable();
    table
      .integer('position')
      .notNullable();
    table
      .integer('card_type')
      .defaultTo(0);
    table
      .string('description', 4096);
    table
      .integer('color');
    table
      .timestamps(false, true);
  });

  await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableName);
};
