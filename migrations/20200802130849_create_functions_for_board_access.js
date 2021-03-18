/* eslint-disable no-return-await */

exports.up = async (knex) => {
  await knex.raw(`
    CREATE FUNCTION get_user_ids_by_board_id(integer)
    RETURNS integer[] AS
    $$
    DECLARE
        userIds integer[];
    BEGIN
        userIds := (SELECT array_agg(user_id)
                     FROM boards_access
                     WHERE board_id = $1);
        RETURN userIds;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE FUNCTION get_user_ids_by_column_id(integer)
      RETURNS integer[] AS
    $$
    DECLARE
        boardId integer;
    BEGIN
        boardId := (SELECT board_id
                    FROM columns
                    WHERE id = $1
                    LIMIT 1);
        RETURN get_user_ids_by_board_id(boardId);
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE FUNCTION get_user_ids_by_heading_id(integer)
      RETURNS integer[] AS
    $$
    DECLARE
        columnId integer;
    BEGIN
        columnId := (SELECT column_id
                    FROM headings
                    WHERE id = $1
                    LIMIT 1);
        RETURN get_user_ids_by_column_id(columnId);
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE FUNCTION get_user_ids_by_todo_id(integer)
      RETURNS integer[] AS
    $$
    DECLARE
        headingId integer;
    BEGIN
        headingId := (SELECT heading_id
                    FROM todos
                    WHERE id = $1
                    LIMIT 1);
        RETURN get_user_ids_by_heading_id(headingId);
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE FUNCTION get_user_ids_by_comment_id(integer)
      RETURNS integer[] AS
    $$
    DECLARE
        todoId integer;
    BEGIN
        todoId := (SELECT todo_id
                    FROM comments
                    WHERE id = $1
                    LIMIT 1);
        RETURN get_user_ids_by_todo_id(todoId);
    END;
    $$ LANGUAGE plpgsql;
  `);

  await knex.raw(`
    CREATE FUNCTION get_user_ids_by_comment_file_id(integer)
      RETURNS integer[] AS
    $$
    DECLARE
        commentId integer;
    BEGIN
        commentId := (SELECT comment_id
                    FROM comment_files
                    WHERE id = $1
                    LIMIT 1);
        RETURN get_user_ids_by_comment_id(commentId);
    END;
    $$ LANGUAGE plpgsql;
  `);
};

exports.down = async (knex) => {
  await knex.raw('DROP FUNCTION IF EXISTS get_user_ids_by_board_id;');
  await knex.raw('DROP FUNCTION IF EXISTS get_user_ids_by_column_id;');
  await knex.raw('DROP FUNCTION IF EXISTS get_user_ids_by_heading_id;');
  await knex.raw('DROP FUNCTION IF EXISTS get_user_ids_by_todo_id;');
  await knex.raw('DROP FUNCTION IF EXISTS get_user_ids_by_comment_id;');
  await knex.raw('DROP FUNCTION IF EXISTS get_user_ids_by_comment_file_id;');
};
