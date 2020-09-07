const { tables } = require('../src/database/tables');

const tableName = tables.boardPositions;

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
      .specificType('positions', 'integer ARRAY')
      .references('id');
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
