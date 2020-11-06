const { Database } = require('../database');

class TodoService extends Database {
  async create(todo) {
    const [todoId] = await this.todos
      .insert(todo)
      .returning('id');
    return todoId;
  }

  async getBoardIdByTodoId(id) {
    const getColumnId = this.todos
      .select([
        'columnId',
      ])
      .where({
        id,
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
    return this.todos
      .select([
        'id',
        'columnId',
        'title',
        'description',
        'status',
        'color',
        'isArchived',
        'isNotificationsEnabled',
      ])
      .where({
        id,
      })
      .first();
  }

  getByColumnId(columnId) {
    return this.todos
      .select([
        'todos.id',
        'columnId',
        'title',
        'description',
        'status',
        'color',
        'isArchived',
        'isNotificationsEnabled',
      ])
      .count('comments.id', { as: 'commentsCount' })
      .leftJoin('comments', 'todos.id', 'comments.todoId')
      .where({
        columnId,
      })
      .groupBy('todos.id');
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
    return this.todos
      .select([
        'todos.id',
        'columnId',
        'title',
        'description',
        'status',
        'color',
        'isArchived',
        'isNotificationsEnabled',
      ])
      .count('comments.id', { as: 'commentsCount' })
      .leftJoin('comments', 'todos.id', 'comments.todoId')
      .whereIn(
        'columnId',
        getColumnIds,
      )
      .groupBy('todos.id');
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
        'columnId',
        'title',
        'description',
        'status',
        'color',
        'isArchived',
        'isNotificationsEnabled',
      ])
      .del();
    return removedTodo;
  }

  getColumnId(id) {
    return this.todos
      .select([
        'columnId',
      ])
      .where({
        id,
      })
      .first();
  }
}

module.exports = {
  TodoService: new TodoService(),
};
