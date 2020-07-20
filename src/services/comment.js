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
      .whereIn(
        'id',
        getTodoId,
      )
      .first();
    const response = await this.columns
      .select([
        'boardId',
      ])
      .whereIn(
        'id',
        getColumnId,
      )
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
        'isEdited',
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
    console.log('get all comments by boardIds', boardIds);

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
}

module.exports = {
  CommentService: new CommentService(),
};
