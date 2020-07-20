exports.up = (knex) => knex.schema.createTable('boards', (table) => {
  table
    .increments('id')
    .primary();
  table
    .string('title')
    .notNullable();
  table
    .integer('position')
    .notNullable();
  table
    .integer('card_type')
    .defaultTo(0);
  table
    .string('description', 4096);
  table
    .integer('color');
  table
    .timestamp('created_at')
    .defaultTo(knex.fn.now());
  table
    .timestamp('updated_at')
    .defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('boards');
