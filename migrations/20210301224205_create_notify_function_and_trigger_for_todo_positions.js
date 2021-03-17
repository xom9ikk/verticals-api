const { tables } = require('../src/database/tables');
const { triggers } = require('../src/database/triggers');

const tableName = tables.todoPositions;

exports.up = async (knex) => {
  await knex.raw(`
    CREATE FUNCTION notify_${triggers.todoPositionChange}()
      RETURNS trigger AS
    $$
    DECLARE
      object ${tableName}%ROWTYPE;
      userIds integer[];
    BEGIN
      IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE'
      THEN
          object := NEW;
      ELSIF TG_OP = 'DELETE'
      THEN
          object := OLD;
      END IF;
      userIds := get_user_ids_by_heading_id(object.heading_id);
      PERFORM pg_notify('${triggers.todoPositionChange}', json_build_object(
              'userIds', userIds,
              'object', row_to_json(object),
              'operation', TG_OP)::text);
      RETURN object;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`CREATE TRIGGER ${triggers.todoPositionChange}_trigger
    AFTER INSERT OR UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.todoPositionChange}();
  `);

  await knex.raw(`CREATE TRIGGER ${triggers.todoPositionChange}_delete_trigger
    BEFORE DELETE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.todoPositionChange}();
  `);
};

exports.down = async (knex) => {
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.todoPositionChange}_trigger ON ${tableName};`);
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.todoPositionChange}_delete_trigger ON ${tableName};`);
  await knex.raw(`DROP FUNCTION IF EXISTS notify_${triggers.todoPositionChange};`);
};
