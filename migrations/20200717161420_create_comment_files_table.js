/* eslint-disable no-return-await */
const { tables } = require('../src/database/tables');
const { triggers } = require('../src/database/triggers');

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
    CREATE FUNCTION notify_${triggers.commentFilesChange}()
      RETURNS trigger AS
    $$
    DECLARE
      object comment_files%ROWTYPE;
      userIds integer[];
    BEGIN
      IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE'
      THEN
          object := NEW;
      ELSIF TG_OP = 'DELETE'
      THEN
          object := OLD;
      END IF;
      userIds := (SELECT array_agg(user_id)
        FROM boards_access
        WHERE board_id = (SELECT board_id
          FROM columns
          WHERE id = (SELECT column_id
            FROM todos
            WHERE id = (SELECT todo_id
              FROM comments
              WHERE id = (SELECT comment_id
                FROM comment_files
                WHERE id = object.id
                LIMIT 1)
              LIMIT 1)
            LIMIT 1)
          LIMIT 1)
        );
      PERFORM pg_notify('${triggers.commentFilesChange}', json_build_object(
              'userIds', userIds,
              'object', row_to_json(object),
              'operation', TG_OP)::text);
      RETURN object;
    END;
    $$ LANGUAGE plpgsql;`);

  await knex.raw(`CREATE TRIGGER ${triggers.commentFilesChange}_trigger
    AFTER INSERT OR UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.commentFilesChange}();`);

  await knex.raw(`CREATE TRIGGER ${triggers.commentFilesChange}_delete_trigger
    BEFORE DELETE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.commentFilesChange}();`);

  await knex.raw(`CREATE FUNCTION notify_${triggers.commentFilesDelete}() RETURNS trigger AS $$
    DECLARE
    BEGIN
      PERFORM pg_notify('${triggers.commentFilesDelete}', json_build_object('object',row_to_json(OLD),'operation',TG_OP)::text);
      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;`);

  await knex.raw(`CREATE TRIGGER ${triggers.commentFilesDelete}_trigger
    AFTER DELETE ON ${tableName}
    FOR EACH ROW EXECUTE PROCEDURE notify_${triggers.commentFilesDelete}();`);

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
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.commentFilesChange}_trigger ON ${tableName};`);
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.commentFilesChange}_delete_trigger ON ${tableName};`);
  await knex.raw(`DROP FUNCTION IF EXISTS notify_${triggers.commentFilesChange};`);
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.commentFilesDelete}_trigger ON ${tableName};`);
  await knex.raw(`DROP FUNCTION IF EXISTS notify_${triggers.commentFilesDelete};`);
};
