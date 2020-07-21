/* eslint-disable no-return-await */
exports.up = async (knex) => await knex.schema.createTable('comments', (table) => {
  table
    .increments('id')
    .primary();
  table
    .integer('todo_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('todos');
  table
    .string('text', 4096);
  table
    .integer('reply_comment_id')
    .references('id')
    .inTable('comments');
  table
    .boolean('is_edited')
    .defaultTo(false);
  table
    .timestamp('created_at')
    .defaultTo(knex.fn.now());
  table
    .timestamp('updated_at')
    .defaultTo(knex.fn.now());
});

exports.down = async (knex) => await knex.schema.dropTable('comments');
