const { tables } = require('../src/database/tables');

const tableName = tables.subTodos;

exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table
      .increments('id')
      .primary();
    table
      .integer('todo_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(tables.todos)
      .onDelete('CASCADE');
    table
      .string('title')
      .notNullable();
    table
      .string('description', 4096);
    table
      .integer('status')
      .defaultTo(0);
    table
      .integer('color');
    table
      .boolean('is_notifications_enabled')
      .defaultTo(true);
    table
      .date('expiration_date');
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
  await knex.schema.dropTable(tableName);
};
