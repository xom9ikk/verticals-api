/* eslint-disable no-return-await */
const { tables } = require('../src/database/tables');

const tableName = tables.comments;

exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table
      .increments('id')
      .primary();
    table
      .integer('todo_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('todos')
      .onDelete('CASCADE');
    table
      .string('text', 4096);
    table
      .integer('reply_comment_id')
      .references('id')
      .inTable('comments')
      .onDelete('CASCADE');
    table
      .boolean('is_edited')
      .defaultTo(false);
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

exports.down = async (knex) => await knex.schema.dropTable('comments');
