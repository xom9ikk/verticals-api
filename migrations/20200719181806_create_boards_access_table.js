/* eslint-disable no-return-await */
const { tables } = require('../src/database/tables');

const tableName = tables.boardsAccess;

exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table.primary(['board_id', 'user_id']);
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('board_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('boards');
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

exports.down = async (knex) => await knex.schema.dropTable('boards_access');
