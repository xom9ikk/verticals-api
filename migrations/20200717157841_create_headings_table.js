const { tables } = require('../src/database/tables');

const tableName = tables.headings;

exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table
      .increments('id')
      .primary();
    table
      .integer('column_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('columns')
      .onDelete('CASCADE');
    table
      .string('title')
      .notNullable();
    table
      .string('description', 4096);
    table
      .integer('color');
    table
      .boolean('is_collapsed')
      .defaultTo(false);
    table
      .integer('type')
      .notNullable();
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
