/* eslint-disable no-return-await */
exports.up = async (knex) => await knex.schema.createTable('columns', (table) => {
  table
    .increments('id')
    .primary();
  table
    .integer('board_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('boards')
    .onDelete('CASCADE');
  table
    .string('title')
    .notNullable();
  table
    .integer('position')
    .notNullable();
  table
    .string('description', 4096);
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

exports.down = async (knex) => await knex.schema.dropTable('columns');
