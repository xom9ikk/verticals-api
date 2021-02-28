const { ColumnService } = require('./column');
const { TodoService } = require('./todo');
const { CommentService } = require('./comment');
const { CommentFilesService } = require('./comment-files');
const { Database } = require('../database');

class BoardAccessService extends Database {
  async create(userId, boardId) {
    const [boardAccess] = await this.boardsAccess
      .insert({
        userId,
        boardId,
      })
      .returning(['userId', 'boardId']);
    return boardAccess;
  }

  getByBoardId(userId, boardId) {
    return this.boardsAccess
      .select([
        'userId',
        'boardId',
      ])
      .where({
        userId,
        boardId,
      })
      .first();
  }

  getByColumnId(userId, columnId) {
    const boardId = ColumnService.getBoardIdSubQuery(columnId);
    return this.boardsAccess
      .select([
        'userId',
        'boardId',
      ])
      .where({
        boardId,
        userId,
      })
      .first();
  }

  getByTodoId(userId, todoId) {
    const columnId = TodoService.getColumnIdSubQuery(todoId);
    const boardId = ColumnService.getBoardIdSubQuery(columnId);
    return this.boardsAccess
      .select([
        'userId',
        'boardId',
      ])
      .where({
        boardId,
        userId,
      })
      .first();
  }

  getByCommentId(userId, commentId) {
    const todoId = CommentService.getTodoIdSubQuery(commentId);
    const columnId = TodoService.getColumnIdSubQuery(todoId);
    const boardId = ColumnService.getBoardIdSubQuery(columnId);
    return this.boardsAccess
      .select([
        'userId',
        'boardId',
      ])
      .where({
        boardId,
        userId,
      })
      .first();
  }

  getByAttachmentId(userId, attachmentId) {
    const commentId = CommentFilesService.getCommentIdSubQuery(attachmentId);
    const todoId = CommentService.getTodoIdSubQuery(commentId);
    const columnId = TodoService.getColumnIdSubQuery(todoId);
    const boardId = ColumnService.getBoardIdSubQuery(columnId);
    return this.boardsAccess
      .select([
        'userId',
        'boardId',
      ])
      .where({
        boardId,
        userId,
      })
      .first();
  }

  async getAllBoardIdsByUserId(userId) {
    const response = await this.boardsAccess
      .select([
        'boardId',
      ])
      .where({
        userId,
      });
    return response.map((row) => row.boardId);
  }

  removeByBoardId(boardId) {
    return this.boardsAccess
      .where({
        boardId,
      })
      .del();
  }
}

module.exports = {
  BoardAccessService: new BoardAccessService(),
};
