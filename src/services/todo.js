const { Database } = require('../database');
const { HeadingType } = require('../constants');

class TodoService extends Database {
  async create(todo) {
    const [todoId] = await this.todos
      .insert(todo)
      .returning('id');
    return todoId;
  }

  getById(id) {
    return this.todos
      .select([
        'id',
        'headingId',
        'title',
        'description',
        'status',
        'color',
        'isNotificationsEnabled',
        'expirationDate',
      ])
      .where({
        id,
      })
      .first();
  }

  async getByHeadingId(headingId) {
    const response = await this.todos
      .select([
        'todos.id',
        'headingId',
        'title',
        'description',
        'status',
        'color',
        'isNotificationsEnabled',
        'expirationDate',
      ])
      .countDistinct('comments.id', { as: 'commentsCount' })
      .sum({
        imagesCount: knex.raw('case when comment_files.mime_type = ? or comment_files.mime_type = ? then 1 else 0 end',
          ['image/jpeg', 'image/png']),
        attachmentsCount: knex.raw('case when comment_files.mime_type != ? and comment_files.mime_type != ? then 1 else 0 end',
          ['image/jpeg', 'image/png']),
      })
      .leftJoin('comments', 'comments.todoId', 'todos.id')
      .leftJoin('commentFiles', 'commentFiles.commentId', 'comments.id')
      .where({
        headingId,
      })
      .groupBy('todos.id');
    return response.map((todo) => ({
      ...todo,
      commentsCount: parseInt(todo.commentsCount),
      imagesCount: parseInt(todo.imagesCount),
      attachmentsCount: parseInt(todo.attachmentsCount),
    }));
  }

  async getByColumnId(columnId) {
    const getHeadingIds = this.headings
      .select([
        'id',
      ])
      .whereNot({ type: HeadingType.removed })
      .andWhere({ columnId });
    const response = await this.todos
      .select([
        'todos.id',
        'headingId',
        'title',
        'description',
        'status',
        'color',
        'isNotificationsEnabled',
        'expirationDate',
      ])
      .countDistinct('comments.id', { as: 'commentsCount' })
      .sum({
        imagesCount: knex.raw('case when comment_files.mime_type = ? or comment_files.mime_type = ? then 1 else 0 end',
          ['image/jpeg', 'image/png']),
        attachmentsCount: knex.raw('case when comment_files.mime_type != ? and comment_files.mime_type != ? then 1 else 0 end',
          ['image/jpeg', 'image/png']),
      })
      .leftJoin('comments', 'comments.todoId', 'todos.id')
      .leftJoin('commentFiles', 'commentFiles.commentId', 'comments.id')
      .whereIn(
        'headingId',
        getHeadingIds,
      )
      .groupBy('todos.id');
    return response.map((todo) => ({
      ...todo,
      commentsCount: parseInt(todo.commentsCount),
      imagesCount: parseInt(todo.imagesCount),
      attachmentsCount: parseInt(todo.attachmentsCount),
    }));
  }

  async getByBoardIds(boardIds, isRemoved = false) {
    const getColumnIds = this.columns
      .select([
        'id',
      ])
      .whereIn(
        'boardId',
        boardIds,
      );
    const getHeadingIdsRemoved = this.headings
      .select([
        'id',
      ])
      .whereIn(
        'columnId',
        getColumnIds,
      )
      .andWhere({ type: HeadingType.removed });
    const getHeadingIdsNotRemoved = this.headings
      .select([
        'id',
      ])
      .whereIn(
        'columnId',
        getColumnIds,
      )
      .andWhereNot({ type: HeadingType.removed });
    const response = await this.todos
      .select([
        'todos.id',
        'headingId',
        'title',
        'description',
        'status',
        'color',
        'isNotificationsEnabled',
        'expirationDate',
      ])
      .countDistinct('comments.id', { as: 'commentsCount' })
      .sum({
        imagesCount: knex.raw('case when comment_files.mime_type = ? or comment_files.mime_type = ? then 1 else 0 end',
          ['image/jpeg', 'image/png']),
        attachmentsCount: knex.raw('case when comment_files.mime_type != ? and comment_files.mime_type != ? then 1 else 0 end',
          ['image/jpeg', 'image/png']),
      })
      .leftJoin('comments', 'comments.todoId', 'todos.id')
      .leftJoin('commentFiles', 'commentFiles.commentId', 'comments.id')
      .whereIn(
        'headingId',
        isRemoved ? getHeadingIdsRemoved : getHeadingIdsNotRemoved,
      )
      .groupBy('todos.id');
    return response.map((todo) => ({
      ...todo,
      commentsCount: parseInt(todo.commentsCount),
      imagesCount: parseInt(todo.imagesCount),
      attachmentsCount: parseInt(todo.attachmentsCount),
    }));
  }

  getRemovedByBoardIds(boardIds) {
    return this.getByBoardIds(boardIds, true);
  }

  async update(id, todo) {
    const [todoId] = await this.todos
      .where({
        id,
      })
      .update(todo)
      .returning('id');
    return todoId;
  }

  async removeById(todoId) {
    const [removedTodo] = await this.todos
      .where({
        id: todoId,
      })
      .returning([
        'id',
        'headingId',
        'title',
        'description',
        'status',
        'color',
        'isNotificationsEnabled',
        'expirationDate',
      ])
      .del();
    return removedTodo;
  }

  getHeadingIdSubQuery(id) {
    return this.todos
      .select([
        'headingId',
      ])
      .where({
        id,
      })
      .first();
  }

  async getHeadingId(id) {
    const res = await this.getHeadingIdSubQuery(id);
    return res.headingId;
  }
}

module.exports = {
  TodoService: new TodoService(),
};
