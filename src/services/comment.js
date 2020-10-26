const { Database } = require('../database');

class CommentService extends Database {
  async create(comment) {
    const [commentId] = await this.comments
      .insert(comment)
      .returning('id');
    return commentId;
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
    return this.comments
      .select([
        'id',
        'todoId',
        'text',
        'replyCommentId',
        'updatedAt',
        'createdAt',
      ])
      .where({
        id,
      })
      .first();
  }

  getByTodoId(todoId) {
    return this.comments
      .select([
        'id',
        'todoId',
        'text',
        'replyCommentId',
        'updatedAt',
        'createdAt',
      ])
      .where({
        todoId,
      })
      .orderBy('createdAt');
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
        'updatedAt',
        'createdAt',
      ])
      .whereIn(
        'todoId',
        getTodoIds,
      )
      .orderBy('createdAt');
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
        'updatedAt',
        'createdAt',
      ])
      .whereIn(
        'todoId',
        getTodoIds,
      )
      .orderBy('createdAt');
  }

  async update(id, todo) {
    const [commentId] = await this.comments
      .where({
        id,
      })
      .update(todo)
      .returning('id');
    return commentId;
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
