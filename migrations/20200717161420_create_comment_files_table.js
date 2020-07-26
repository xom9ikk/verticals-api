/* eslint-disable no-return-await */
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

  await knex.raw(`CREATE FUNCTION notify_comment_files_delete_trigger() RETURNS trigger AS $$
    DECLARE
    BEGIN
      PERFORM pg_notify('comment_files_delete', row_to_json(OLD)::text);
      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;`);

  await knex.raw(`CREATE TRIGGER comment_files_delete_trigger
    AFTER DELETE ON ${tableName}
    FOR EACH ROW EXECUTE PROCEDURE notify_comment_files_delete_trigger();`);

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
  await knex.raw(`DROP TRIGGER IF EXISTS comment_files_delete_trigger ON ${tableName};`);
  await knex.raw('DROP FUNCTION IF EXISTS notify_comment_files_delete_trigger;');
};
