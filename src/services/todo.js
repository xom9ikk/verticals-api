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

  async getByColumnId(columnId) {
    const response = await this.todos
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
    return response.map((todo) => ({ ...todo, commentsCount: parseInt(todo.commentsCount) }));
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
    const response = await this.todos
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
        'columnId',
        getColumnIds,
      )
      .groupBy('todos.id');
    return response.map((todo) => ({
      ...todo,
      commentsCount: parseInt(todo.commentsCount),
      imagesCount: parseInt(todo.imagesCount),
      attachmentsCount: parseInt(todo.attachmentsCount),
    }));
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
