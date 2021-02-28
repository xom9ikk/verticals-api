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
        'comments.id',
        'comments.todoId',
        'comments.text',
        'comments.replyCommentId',
        'comments.updatedAt',
        'comments.createdAt',
        knex.raw('COALESCE(json_agg(json_build_object('
          + '\'avatar\', users.avatar,'
          + '\'username\', users.username,'
          + '\'name\', users.name,'
          + '\'surname\', users.surname'
          + ')) FILTER (WHERE users.id IS NOT NULL), \'[]\') AS liked_users'),
      ])
      .where({
        todoId,
      })
      .leftJoin('commentLikes', 'commentLikes.commentId', 'comments.id')
      .leftJoin('users', 'users.id', 'commentLikes.userId')
      .groupBy('comments.id')
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

  getTodoIdSubQuery(id) {
    return this.comments
      .select([
        'todoId',
      ])
      .where({
        id,
      })
      .first();
  }

  async getTodoId(id) {
    const res = await this.getTodoIdSubQuery(id);
    return res.todoId;
  }
}

module.exports = {
  CommentService: new CommentService(),
};
