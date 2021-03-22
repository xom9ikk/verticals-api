const { tables } = require('../src/database/tables');

const tableName = tables.subTodoPositions;

exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table
      .integer('todo_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable(tables.todos)
      .onDelete('CASCADE');
    table
      .specificType('order', 'integer ARRAY');
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
