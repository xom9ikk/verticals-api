const { tables } = require('../src/database/tables');

const tableName = tables.headingPositions;

exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table
      .integer('column_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('columns')
      .onDelete('CASCADE');
    table
      .specificType('order', 'integer ARRAY');
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
