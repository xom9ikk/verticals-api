const { tables } = require('../src/database/tables');

const tableName = tables.comments;

/**
 * Problem: https://stackoverflow.com/questions/922184/why-can-you-not-have-a-foreign-key-in-a-polymorphic-association
 * Implementation options:
 *   1) Polymorphic association - antipattern
 *   2) Exclusive Arcs
 *   3) Reverse the Relationship
 *   4) Concrete Supertable
 * Selected implementation option:
 *   2) Exclusive Arcs
 */

exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table
      .increments('id')
      .primary();
    table
      .integer('todo_id')
      .unsigned()
      .references('id')
      .inTable('todos')
      .onDelete('CASCADE');
    table
      .integer('sub_todo_id')
      .unsigned()
      .references('id')
      .inTable('sub_todos')
      .onDelete('CASCADE');
    table
      .string('text', 16384);
    table
      .integer('reply_comment_id')
      .references('id')
      .inTable('comments')
      .onDelete('CASCADE');
    table
      .timestamps(false, true);
    table
      .unique(['todo_id', 'sub_todo_id']);
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
