exports.up = (knex) => knex.schema.createTable('users', (table) => {
  table
    .uuid('uuid')
    .primary()
    .defaultTo(knex.raw('uuid_generate_v4()'));
  table
    .string('email')
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
    .notNullable();
  table
    .timestamp('created_at')
    .defaultTo(knex.fn.now());
  table
    .timestamp('updated_at')
    .defaultTo(knex.fn.now());
});

exports.down = (knex) => knex.schema.dropTable('users');
