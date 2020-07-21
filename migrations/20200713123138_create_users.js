/* eslint-disable no-return-await */
exports.up = async (knex) => await knex.schema.createTable('users', (table) => {
  table
    .increments('id')
    .primary();
  table
    .string('email')
    .unique()
    .notNullable();
  table
    .string('password')
    .notNullable();
  table
    .string('name')
    .notNullable();
  table
    .string('surname')
    .notNullable();
  table
    .string('username')
    .unique()
    .notNullable();
  table
    .timestamp('created_at')
    .defaultTo(knex.fn.now());
  table
    .timestamp('updated_at')
    .defaultTo(knex.fn.now());
});

exports.down = async (knex) => await knex.schema.dropTable('users');
