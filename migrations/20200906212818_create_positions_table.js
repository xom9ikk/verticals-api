const { tables } = require('../src/database/tables');

const tableName = tables.positions;

exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .specificType('boards', 'integer ARRAY');
    table
      .specificType('columns', 'integer ARRAY');
    table
      .specificType('todos', 'integer ARRAY');
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
