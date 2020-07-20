const { TodoService, ColumnService, BoardAccessService } = require('../../services');
const { BackendError } = require('../../components');

class TodoController {
  async create(userId, todo) {
    const { columnId } = todo;
    const boardId = await ColumnService.getBoardIdByColumnId(columnId);

    if (boardId === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to create todo for this column');
    }

    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create todo for this column');
    }

    const todoId = await TodoService.create(todo);
    return todoId;
  }

  async get(userId, todoId) {
    const boardId = await TodoService.getBoardIdByTodoId(todoId);

    if (boardId === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to receive this todo');
    }

    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this todo');
    }

    const todo = await TodoService.getById(todoId);
    return todo;
  }

  async getAll(userId, boardId, columnId) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccess = await BoardAccessService.get(userId, boardId);
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
    const boardId = await TodoService.getBoardIdByTodoId(todoId);

    if (boardId === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to edit this todo');
    }

    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this todo');
    }

    const updatedTodo = await TodoService.update(todoId, patch);

    if (updatedTodo === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to edit this todo');
    }

    return true;
  }

  async remove({ userId, todoId }) {
    const boardId = await TodoService.getBoardIdByTodoId(todoId);

    if (boardId === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to remove this todo');
    }

    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this todo');
    }

    await TodoService.removeById(todoId);
    return true;
  }
}

module.exports = {
  TodoController: new TodoController(),
};
