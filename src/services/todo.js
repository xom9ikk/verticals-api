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
        columnId,
      });
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
        'id',
        'columnId',
        'title',
        'description',
        'status',
        'color',
        'isArchived',
        'isNotificationsEnabled',
      ])
      .whereIn(
        'columnId',
        getColumnIds,
      );
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

  async removeById(boardId) {
    const [removedTodo] = await this.todos
      .where({
        id: boardId,
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
