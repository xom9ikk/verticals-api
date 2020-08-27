const { tables } = require('../src/database/tables');
const { triggers } = require('../src/database/triggers');

const tableName = tables.boardsAccess;

exports.up = async (knex) => {
  await knex.raw(`
    CREATE FUNCTION notify_${triggers.boardChange}_insert_or_delete()
    RETURNS trigger AS
    $$
    DECLARE
        board  boards%ROWTYPE;
        object boards_access%ROWTYPE;
    BEGIN
        IF TG_OP = 'INSERT'
        THEN
            object := NEW;
        ELSIF TG_OP = 'DELETE'
        THEN
            object := OLD;
        END IF;
        
        SELECT *
          INTO board
          FROM boards
          WHERE id = object.board_id
          LIMIT 1;
        
        PERFORM pg_notify('${triggers.boardChange}', json_build_object(
                'userIds', json_agg(object.user_id),
                'object', row_to_json(board),
                'operation', TG_OP)::text);
        RETURN object;
    END;
    $$ LANGUAGE plpgsql;

  `);

  await knex.raw(`CREATE TRIGGER ${triggers.boardChange}_insert_trigger
    AFTER INSERT
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.boardChange}_insert_or_delete();
  `);

  await knex.raw(`CREATE TRIGGER ${triggers.boardChange}_delete_trigger
    BEFORE DELETE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.boardChange}_insert_or_delete();
  `);
};

exports.down = async (knex) => {
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.boardChange}_insert_trigger ON ${tableName};`);
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.boardChange}_delete_trigger ON ${tableName};`);
  await knex.raw(`DROP FUNCTION IF EXISTS notify_${triggers.boardChange}_insert_or_delete;`);
};
