/* eslint-disable no-return-await */
exports.up = async (knex) => await knex.schema.createTable('comment_files', (table) => {
  table
    .increments('id')
    .primary();
  table
    .integer('comment_id')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('comments')
    .onDelete('CASCADE');
  table
    .string('path')
    .notNullable();
  table
    .string('name')
    .notNullable();
  table
    .string('extension')
    .notNullable();
  table
    .integer('size')
    .notNullable();
  table
    .string('mime_type')
    .nullable();
  table
    .string('encoding')
    .nullable();
  table
    .timestamp('created_at')
    .defaultTo(knex.fn.now());
  table
    .timestamp('updated_at')
    .defaultTo(knex.fn.now());
});

exports.down = async (knex) => await knex.schema.dropTable('comment_files');
