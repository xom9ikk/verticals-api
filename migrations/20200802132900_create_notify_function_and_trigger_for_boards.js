const { tables } = require('../src/database/tables');
const { triggers } = require('../src/database/triggers');

const tableName = tables.boards;

exports.up = async (knex) => {
  await knex.raw(`
    CREATE FUNCTION notify_${triggers.boardChange}()
      RETURNS trigger AS
    $$
    DECLARE
      object boards%ROWTYPE;
      userIds integer[];
    BEGIN
      object := NEW;
      userIds := get_user_ids_by_board_id(object.id);
      PERFORM pg_notify('${triggers.boardChange}', json_build_object(
              'userIds', userIds,
              'object', row_to_json(object),
              'operation', TG_OP)::text);
      RETURN object;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`CREATE TRIGGER ${triggers.boardChange}_trigger
    AFTER UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.boardChange}();
  `);
};

exports.down = async (knex) => {
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.boardChange}_trigger ON ${tableName};`);
  await knex.raw(`DROP FUNCTION IF EXISTS notify_${triggers.boardChange};`);
};
