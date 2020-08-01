/* eslint-disable no-return-await */
const { tables } = require('../src/database/tables');
const { triggers } = require('../src/database/triggers');

const tableName = tables.columns;

exports.up = async (knex) => {
  await knex.schema.createTable(tableName, (table) => {
    table
      .increments('id')
      .primary();
    table
      .integer('board_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('boards')
      .onDelete('CASCADE');
    table
      .string('title')
      .notNullable();
    table
      .integer('position')
      .notNullable();
    table
      .string('description', 4096);
    table
      .integer('color');
    table
      .boolean('is_collapsed')
      .defaultTo(false);
    table
      .timestamps(false, true);
  });

  await knex.raw(`
    CREATE FUNCTION notify_${triggers.columnChange}()
      RETURNS trigger AS
    $$
    DECLARE
      object columns%ROWTYPE;
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
          WHERE id = object.id
          LIMIT 1)
         );
      PERFORM pg_notify('${triggers.columnChange}', json_build_object(
              'userIds', userIds,
              'object', row_to_json(object),
              'operation', TG_OP)::text);
      RETURN object;
    END;
    $$ LANGUAGE plpgsql;`);

  await knex.raw(`CREATE TRIGGER ${triggers.columnChange}_trigger
    AFTER INSERT OR UPDATE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.columnChange}();`);

  await knex.raw(`CREATE TRIGGER ${triggers.columnChange}_delete_trigger
    BEFORE DELETE
    ON ${tableName}
    FOR EACH ROW
    EXECUTE PROCEDURE notify_${triggers.columnChange}();`);

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
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.columnChange}_trigger ON ${tableName};`);
  await knex.raw(`DROP TRIGGER IF EXISTS ${triggers.columnChange}_delete_trigger ON ${tableName};`);
  await knex.raw(`DROP FUNCTION IF EXISTS notify_${triggers.columnChange};`);
};
