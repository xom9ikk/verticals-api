const { tables } = require('../src/database/tables');

const tableName = tables.users;

exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
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
      .timestamps(false, true);
  });

  await knex.raw(`
    CREATE TRIGGER update_timestamp
    BEFORE UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE update_timestamp();
  `);
};

exports.down = async (knex) => {
  await knex.schema.dropTable('users');
};
