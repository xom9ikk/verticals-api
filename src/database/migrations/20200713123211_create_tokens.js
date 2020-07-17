exports.up = (knex) => knex.schema.createTable('tokens', (table) => {
  table
    .increments('id')
    .primary();
  table
    .string('refresh_token')
    .notNullable();
  table
    .string('token')
    .notNullable();
  table
    .uuid('uuid')
    .notNullable()
    .references('uuid')
    .inTable('users');
  table
    .string('ip')
    .notNullable();
  table
    .timestamp('created_at')
    .defaultTo(knex.fn.now());
  table
    .timestamp('updated_at')
    .defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('tokens');
