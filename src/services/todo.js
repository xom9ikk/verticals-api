const { Database } = require('../database');

class TodoService extends Database {
  async create(todo) {
    const response = await this.todos
      .insert(todo)
      .returning('id');
    return response[0];
  }

  async getBoardIdByTodoId(id) {
    const subquery = this.todos
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
      .whereIn(
        'id',
        subquery,
      )
      .first();

    return response ? response.boardId : undefined;
  }

  getById(id) {
    return this.todos
      .select([
        'id',
        'columnId',
        'title',
        'position',
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
        'position',
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
    const subquery = this.columns
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
        'position',
        'description',
        'status',
        'color',
        'isArchived',
        'isNotificationsEnabled',
      ])
      .whereIn(
        'columnId',
        subquery,
      );
  }

  async update(id, todo) {
    const response = await this.todos
      .where({
        id,
      })
      .update(todo)
      .returning('id');
    return response[0];
  }

  removeById(id) {
    return this.todos
      .where({
        id,
      })
      .del();
  }
}

module.exports = {
  TodoService: new TodoService(),
};
