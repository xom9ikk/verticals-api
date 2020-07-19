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
    .integer('user_id')
    .unsigned()
    .notNullable()
    .references('id')
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
