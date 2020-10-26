const { Database } = require('../database');

class CommentFilesService extends Database {
  async create(todo) {
    const [commentFileId] = await this.commentFiles
      .insert(todo)
      .returning('id');
    return commentFileId;
  }

  getById(id) {
    return this.commentFiles
      .select([
        'id',
        'commentId',
        'path',
        'name',
        'extension',
        'size',
        'mimeType',
        'encoding',
      ])
      .where({
        id,
      })
      .first();
  }

  getByTodoId(todoId) {
    const getCommentIds = this.comments
      .select([
        'id',
      ])
      .where({
        todoId,
      });

    return this.commentFiles
      .select([
        'id',
        'commentId',
        'path',
        'name',
        'extension',
        'size',
        'mimeType',
        'encoding',
      ])
      .whereIn(
        'commentId',
        getCommentIds,
      );
  }

  getByColumnId(columnId) {
    const getTodoIds = this.todos
      .select([
        'id',
      ])
      .where({
        columnId,
      });

    const getCommentIds = this.comments
      .select([
        'id',
      ])
      .whereIn(
        'todoId',
        getTodoIds,
      );

    return this.commentFiles
      .select([
        'id',
        'commentId',
        'path',
        'name',
        'extension',
        'size',
        'mimeType',
        'encoding',
      ])
      .whereIn(
        'commentId',
        getCommentIds,
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

    const getCommentIds = this.comments
      .select([
        'id',
      ])
      .whereIn(
        'todoId',
        getTodoIds,
      );

    return this.commentFiles
      .select([
        'id',
        'commentId',
        'path',
        'name',
        'extension',
        'size',
        'mimeType',
        'encoding',
      ])
      .whereIn(
        'commentId',
        getCommentIds,
      );
  }

  removeById(id) {
    return this.commentFiles
      .where({
        id,
      })
      .del();
  }

  getCommentId(id) {
    return this.commentFiles
      .select([
        'commentId',
      ])
      .where({
        id,
      })
      .first();
  }
}

module.exports = {
  CommentFilesService: new CommentFilesService(),
};
