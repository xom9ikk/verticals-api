const { tables } = require('../src/database/tables');
const { triggers } = require('../src/database/triggers');

const tableName = tables.comments;

exports.up = async (knex) => {
  await knex.raw(`
    CREATE FUNCTION notify_${triggers.commentChange}()
      RETURNS trigger AS
    $$
    DECLARE
      object comments%ROWTYPE;
      userIds integer[];
    BEGIN
      IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE'
      THEN
          object := NEW;
      ELSIF TG_OP = 'DELETE'
      THEN
          object := OLD;
      END IF;
      userIds := get_user_ids_by_comment_id(object.id);
      PERFORM pg_notify('${triggers.commentChange}', json_build_object(
              'userIds', userIds,
              'object', row_to_json(object),
              'operation', TG_OP)::text);
      RETURN object;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`CREATE TRIGGER ${triggers.commentChange}_trigger
    AFTER INSERT OR UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.commentChange}();
  `);

  await knex.raw(`CREATE TRIGGER ${triggers.commentChange}_delete_trigger
    BEFORE DELETE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.commentChange}();
  `);
};

exports.down = async (knex) => {
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.commentChange}_trigger ON ${tableName};`);
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.commentChange}_delete_trigger ON ${tableName};`);
  await knex.raw(`DROP FUNCTION IF EXISTS notify_${triggers.commentChange};`);
};
