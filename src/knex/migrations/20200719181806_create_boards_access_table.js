exports.up = (knex) => knex.schema.createTable('boards_access', (table) => {
  table
    .increments('id')
    .primary();
  table
    .integer('user_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('users');
  table
    .integer('board_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('boards');
  table
    .timestamp('created_at')
    .defaultTo(knex.fn.now());
  table
    .timestamp('updated_at')
    .defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('boards_access');
