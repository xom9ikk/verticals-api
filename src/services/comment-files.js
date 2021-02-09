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
    return this.comments
      .select([
        'comments.todoId',
        'commentFiles.id',
        'commentFiles.commentId',
        'commentFiles.path',
        'commentFiles.name',
        'commentFiles.extension',
        'commentFiles.size',
        'commentFiles.mimeType',
        'commentFiles.encoding',
      ])
      .rightJoin('commentFiles', 'commentFiles.comment_id', 'comments.id')
      .where({
        todoId,
      })
      .orderBy('comments.createdAt');
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
        'comments.todoId',
        'commentFiles.id',
        'commentFiles.commentId',
        'commentFiles.path',
        'commentFiles.name',
        'commentFiles.extension',
        'commentFiles.size',
        'commentFiles.mimeType',
        'commentFiles.encoding',
      ])
      .rightJoin('commentFiles', 'commentFiles.comment_id', 'comments.id')
      .whereIn(
        'todoId',
        getTodoIds,
      )
      .orderBy('comments.createdAt');
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
        'comments.todoId',
        'commentFiles.id',
        'commentFiles.commentId',
        'commentFiles.path',
        'commentFiles.name',
        'commentFiles.extension',
        'commentFiles.size',
        'commentFiles.mimeType',
        'commentFiles.encoding',
      ])
      .rightJoin('commentFiles', 'commentFiles.comment_id', 'comments.id')
      .whereIn(
        'todoId',
        getTodoIds,
      )
      .orderBy('comments.createdAt');
  }

  removeById(id) {
    return this.commentFiles
      .where({
        id,
      })
      .del();
  }

  getCommentIdSubQuery(id) {
    return this.commentFiles
      .select([
        'commentId',
      ])
      .where({
        id,
      })
      .first();
  }

  async getCommentId(id) {
    const res = await this.getCommentIdSubQuery(id);
    return res.commentId;
  }
}

module.exports = {
  CommentFilesService: new CommentFilesService(),
};
