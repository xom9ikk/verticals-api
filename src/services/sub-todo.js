const { Database } = require('../database');
const { TodoType } = require('../constants');

class SubTodoService extends Database {
  async create(subTodo) {
    const [subTodoId] = await this.subTodos
      .insert(subTodo)
      .returning('id');
    return subTodoId;
  }

  getById(id) {
    return this.subTodos
      .select([
        'id',
        'todoId',
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

  async getSubTodosWithCounters(todoIds) {
    const response = await this.subTodos
      .select([
        'subTodos.id',
        'todoId',
        'title',
        'description',
        'status',
        'color',
        'isNotificationsEnabled',
        'expirationDate',
      ])
      .countDistinct('comments.id', { as: 'commentsCount' })
      .sum({
        imagesCount: knex.raw(
          'case when comment_files.mime_type = ? or comment_files.mime_type = ? then 1 else 0 end',
          ['image/jpeg', 'image/png'],
        ),
        attachmentsCount: knex.raw(
          'case when comment_files.mime_type != ? and comment_files.mime_type != ? then 1 else 0 end',
          ['image/jpeg', 'image/png'],
        ),
      })
      .leftJoin('comments', 'comments.subTodoId', 'subTodos.id')
      .leftJoin('commentFiles', 'commentFiles.commentId', 'comments.id')
      .whereIn(
        'todoId',
        todoIds,
      )
      .groupBy('subTodos.id');
    return response.map((subTodo) => ({
      ...subTodo,
      commentsCount: parseInt(subTodo.commentsCount),
      imagesCount: parseInt(subTodo.imagesCount),
      attachmentsCount: parseInt(subTodo.attachmentsCount),
    }));
  }

  getByTodoId(todoId) {
    return this.getSubTodosWithCounters([todoId]);
  }

  getByColumnId(columnId) {
    const getTodoIds = this.todos
      .select([
        'id',
      ])
      .whereNot({ type: TodoType.removed })
      .andWhere({ columnId });
    return this.getSubTodosWithCounters(getTodoIds);
  }

  async getByBoardIds(boardIds) {
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
    return this.getSubTodosWithCounters(getTodoIds);
  }

  async update(id, subTodo) {
    const [subTodoId] = await this.subTodos
      .where({
        id,
      })
      .update(subTodo)
      .returning('id');
    return subTodoId;
  }

  async removeById(subTodoId) {
    const [removedSubTodo] = await this.subTodos
      .where({
        id: subTodoId,
      })
      .returning([
        'id',
        'todoId',
        'title',
        'description',
        'status',
        'color',
        'isNotificationsEnabled',
        'expirationDate',
      ])
      .del();
    return removedSubTodo;
  }

  getTodoIdSubQuery(id) {
    return this.subTodos
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
  SubTodoService: new SubTodoService(),
};
