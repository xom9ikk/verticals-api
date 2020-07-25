/* eslint-disable no-return-await */
exports.up = async (knex) => await knex.schema.createTable('boards_access', (table) => {
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
    .timestamp('created_at')
    .defaultTo(knex.fn.now());
  table
    .timestamp('updated_at')
    .defaultTo(knex.fn.now());
});

exports.down = async (knex) => await knex.schema.dropTable('boards_access');
