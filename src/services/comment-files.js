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

  getBySubTodoId(subTodoId) {
    return this.comments
      .select([
        'comments.todoId',
        'comments.subTodoId',
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
        subTodoId,
      })
      .orderBy('comments.createdAt');
  }

  getByTodoId(todoId) {
    return this.comments
      .select([
        'comments.todoId',
        'comments.subTodoId',
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
    const getHeadingIds = this.headings
      .select([
        'id',
      ])
      .where({
        columnId,
      });
    const getTodoIds = this.todos
      .select([
        'id',
      ])
      .whereIn(
        'headingId',
        getHeadingIds,
      );

    return this.comments
      .select([
        'comments.todoId',
        'comments.subTodoId',
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

    const getHeadingIds = this.headings
      .select([
        'id',
      ])
      .whereIn(
        'columnId',
        getColumnIds,
      );

    const getTodoIds = this.todos
      .select([
        'id',
      ])
      .whereIn(
        'headingId',
        getHeadingIds,
      );

    return this.comments
      .select([
        'comments.todoId',
        'comments.subTodoId',
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
