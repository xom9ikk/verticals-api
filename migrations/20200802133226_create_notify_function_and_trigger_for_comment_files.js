const { tables } = require('../src/database/tables');
const { triggers } = require('../src/database/triggers');

const tableName = tables.commentFiles;

exports.up = async (knex) => {
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
      userIds := get_user_ids_by_comment_file_id(object.id);
      PERFORM pg_notify('${triggers.commentFilesChange}', json_build_object(
              'userIds', userIds,
              'object', row_to_json(object),
              'operation', TG_OP)::text);
      RETURN object;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`CREATE TRIGGER ${triggers.commentFilesChange}_trigger
    AFTER INSERT OR UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.commentFilesChange}();
  `);

  await knex.raw(`CREATE TRIGGER ${triggers.commentFilesChange}_delete_trigger
    BEFORE DELETE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.commentFilesChange}();
  `);

  await knex.raw(`CREATE FUNCTION notify_${triggers.commentFilesDelete}() RETURNS trigger AS $$
    DECLARE
    BEGIN
      PERFORM pg_notify('${triggers.commentFilesDelete}', json_build_object('object',row_to_json(OLD),'operation',TG_OP)::text);
      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`CREATE TRIGGER ${triggers.commentFilesDelete}_trigger
    AFTER DELETE ON ${tableName}
    FOR EACH ROW EXECUTE PROCEDURE notify_${triggers.commentFilesDelete}();
  `);
};

exports.down = async (knex) => {
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.commentFilesChange}_trigger ON ${tableName};`);
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.commentFilesChange}_delete_trigger ON ${tableName};`);
  await knex.raw(`DROP FUNCTION IF EXISTS notify_${triggers.commentFilesChange};`);
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.commentFilesDelete}_trigger ON ${tableName};`);
  await knex.raw(`DROP FUNCTION IF EXISTS notify_${triggers.commentFilesDelete};`);
};
