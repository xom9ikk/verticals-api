exports.up = (knex) => knex.schema.createTable('todos', (table) => {
  table
    .increments('id')
    .primary();
  table
    .integer('column_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('columns');
  table
    .string('title')
    .notNullable();
  table
    .integer('position')
    .notNullable();
  table
    .string('description', 4096);
  table
    .integer('status')
    .defaultTo(0);
  table
    .integer('color');
  table
    .boolean('is_archived')
    .defaultTo(false);
  table
    .boolean('is_notifications_enabled')
    .defaultTo(true);
  table
    .timestamp('created_at')
    .defaultTo(knex.fn.now());
  table
    .timestamp('updated_at')
    .defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('todos');
