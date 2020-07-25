const { tables } = require('../database/tables');
const { Database } = require('../database');

class CommentService extends Database {
  async create(todo) {
    const response = await this.comments
      .insert(todo)
      .returning('id');
    return response[0];
  }

  async getBoardIdByCommentId(id) {
    const getTodoId = this.comments
      .select([
        'todoId',
      ])
      .where({
        id,
      })
      .first();
    const getColumnId = this.todos
      .select([
        'columnId',
      ])
      .where({
        id: getTodoId,
      })
      .first();
    const response = await this.columns
      .select([
        'boardId',
      ])
      .where({
        id: getColumnId,
      })
      .first();

    return response ? response.boardId : undefined;
  }

  getById(id) {
    return knex('comments')
      .where({
        'comments.id':
        id,
      })
      .leftJoin(
        'comment_files',
        'comment_files.comment_id',
        id,
      )
      .select(
        'comments.id',
        'comments.todoId',
        'comments.text',
        'comments.replyCommentId',
        'comments.isEdited',
        knex.raw(`COALESCE(json_agg(json_build_object(
               'id', comment_files.id,
               'path', comment_files.path,
               'name', comment_files.name,
               'extension', comment_files.extension,
               'size', comment_files.size,
               'mime_type', comment_files.mime_type,
               'encoding', comment_files.encoding
           )) FILTER (WHERE comment_files.comment_id IS NOT NULL), '[]') AS attached_files`),
      )
      .groupBy('comments.id')
      .first();
  }

  getByTodoId(todoId) {
    return this.comments
      .select([
        'id',
        'todoId',
        'text',
        'replyCommentId',
        'isEdited',
      ])
      .where({
        todoId,
      });
  }

  getByColumnId(columnId) {
    const getTodoIds = this.todos
      .select([
        'id',
      ])
      .where({
        columnId,
      });

    return this.comments
      .select([
        'id',
        'todoId',
        'text',
        'replyCommentId',
        'isEdited',
      ])
      .whereIn(
        'todoId',
        getTodoIds,
      );
  }

  getByBoardIds(boardIds) {
    const getColumnIds = this.columns
      .select([
        'id',
      ])
      .whereIn(
        'boardId',
        boardIds,
      );

    const getTodoIds = this.todos
      .select([
        'id',
      ])
      .whereIn(
        'columnId',
        getColumnIds,
      );

    return this.comments
      .select([
        'id',
        'todoId',
        'text',
        'replyCommentId',
        'isEdited',
      ])
      .whereIn(
        'todoId',
        getTodoIds,
      );
  }

  async update(id, todo) {
    const response = await this.comments
      .where({
        id,
      })
      .update(todo)
      .returning('id');
    return response[0];
  }

  removeById(id) {
    return this.comments
      .where({
        id,
      })
      .del();
  }

  getTodoId(id) {
    return this.comments
      .select([
        'todoId',
      ])
      .where({
        id,
      })
      .first();
  }
}

module.exports = {
  CommentService: new CommentService(),
};
