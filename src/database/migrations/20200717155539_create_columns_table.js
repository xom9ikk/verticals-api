exports.up = (knex) => knex.schema.createTable('columns', (table) => {
  table
    .increments('id')
    .primary();
  table
    .integer('board_id')
    .notNullable()
    .references('id')
    .inTable('boards');
  table
    .string('title')
    .notNullable();
  table
    .integer('position')
    .notNullable();
  table
    .string('description');
  table
    .integer('color');
  table
    .boolean('is_collapsed')
    .defaultTo(false);
  table
    .timestamp('created_at')
    .defaultTo(knex.fn.now());
  table
    .timestamp('updated_at')
    .defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('columns');
