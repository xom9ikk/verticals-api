/* eslint-disable no-return-await */
exports.up = async (knex) => await knex.schema.createTable('files', (table) => {
  table
    .increments('id')
    .primary();
  table
    .integer('comment_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('comments');
  table
    .string('link')
    .notNullable();
  table
    .string('type')
    .notNullable();
  table
    .string('size')
    .notNullable();
  table
    .string('name')
    .notNullable();
  table
    .timestamp('created_at')
    .defaultTo(knex.fn.now());
  table
    .timestamp('updated_at')
    .defaultTo(knex.fn.now());
});

exports.down = async (knex) => await knex.schema.dropTable('files');
