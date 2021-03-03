const { tables } = require('../src/database/tables');
const { triggers } = require('../src/database/triggers');

const tableName = tables.boardPositions;

exports.up = async (knex) => {
  await knex.raw(`
    CREATE FUNCTION notify_${triggers.boardPositionChange}()
      RETURNS trigger AS
    $$
    DECLARE
      object ${tableName}%ROWTYPE;
    BEGIN
      IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE'
      THEN
          object := NEW;
      ELSIF TG_OP = 'DELETE'
      THEN
          object := OLD;
      END IF;
      PERFORM pg_notify('${triggers.boardPositionChange}', json_build_object(
              'userIds', json_agg(object.user_id),
              'object', row_to_json(object),
              'operation', TG_OP)::text);
      RETURN object;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`CREATE TRIGGER ${triggers.boardPositionChange}_trigger
    AFTER INSERT OR UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.boardPositionChange}();
  `);

  await knex.raw(`CREATE TRIGGER ${triggers.boardPositionChange}_delete_trigger
    BEFORE DELETE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.boardPositionChange}();
  `);
};

exports.down = async (knex) => {
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.boardPositionChange}_trigger ON ${tableName};`);
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.boardPositionChange}_delete_trigger ON ${tableName};`);
  await knex.raw(`DROP FUNCTION IF EXISTS notify_${triggers.boardPositionChange};`);
};
