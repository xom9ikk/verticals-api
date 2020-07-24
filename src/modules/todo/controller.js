const { TodoService, BoardAccessService } = require('../../services');
const { BackendError } = require('../../components');

class TodoController {
  async create(userId, todo) {
    const { columnId } = todo;
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create todo for this column');
    }

    const todoId = await TodoService.create(todo);
    return todoId;
  }

  async get(userId, todoId) {
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this todo');
    }

    const todo = await TodoService.getById(todoId);
    return todo;
  }

  async getAll(userId, boardId, columnId) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccess = await BoardAccessService.getByBoardId(userId, boardId);
      if (!isAccess) {
        throw new BackendError.Forbidden('This account is not allowed to receive todos for this board');
      }
      boardIdsWithAccess = [boardId];
    } else {
      boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);
    }

    if (!boardIdsWithAccess.length) {
      throw new BackendError.Forbidden('This account does not have access to any todos');
    }

    let todos;
    if (columnId) {
      todos = await TodoService.getByColumnId(columnId);
    } else {
      todos = await TodoService.getByBoardIds(boardIdsWithAccess);
    }

    if (!todos.length) {
      throw new BackendError.Forbidden('This account does not have access to any todos');
    }

    return todos;
  }

  async update({ userId, todoId, patch }) {
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this todo');
    }

    const { columnId: newColumnId } = patch;

    if (newColumnId) {
      const isAccessToNewColumn = await BoardAccessService.getByColumnId(userId, newColumnId);
      if (!isAccessToNewColumn) {
        throw new BackendError.Forbidden('This account is not allowed to set this columnId for this todo');
      }
    }

    const updatedTodo = await TodoService.update(todoId, patch);

    if (updatedTodo === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to edit this todo');
    }

    return true;
  }

  async remove({ userId, todoId }) {
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this todo');
    }

    // TODO cascade
    await TodoService.removeById(todoId);
    return true;
  }
}

module.exports = {
  TodoController: new TodoController(),
};
