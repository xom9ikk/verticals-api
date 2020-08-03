const { tables } = require('../src/database/tables');

const tableName = tables.commentFiles;

exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
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
