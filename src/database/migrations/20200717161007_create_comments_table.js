exports.up = (knex) => knex.schema.createTable('comments', (table) => {
  table
    .increments('id')
    .primary();
  table
    .integer('todo_id')
    .notNullable()
    .references('id')
    .inTable('todos');
  table
    .string('text');
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

exports.down = (knex) => knex.schema.dropTable('comments');
