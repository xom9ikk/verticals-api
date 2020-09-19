const { TodoService, BoardAccessService, TodoPositionsService } = require('../../services');
const { BackendError } = require('../../components/error');
const { PositionComponent } = require('../../components');

class TodoController {
  async create(userId, { belowId, ...todo }) {
    // TODO: write tests with belowId
    if (belowId) {
      const isAccessToBelowTodoId = await BoardAccessService.getByTodoId(userId, belowId);
      if (!isAccessToBelowTodoId) {
        throw new BackendError.Forbidden('This account is not allowed to create todo below this todo');
      }
    }

    const { columnId } = todo;
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create todo for this column');
    }

    const todoId = await TodoService.create(todo);
    const todoPositions = await TodoPositionsService.getPositions(columnId);
    if (todoPositions.length === 0) {
      await TodoPositionsService.create(columnId, []);
    }

    const {
      newPosition,
      newPositions,
    } = PositionComponent.insert(todoPositions, todoId, belowId);

    await TodoPositionsService.updatePositions(columnId, newPositions);

    return { todoId, position: newPosition };
  }

  async get(userId, todoId) {
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this todo');
    }

    const columnId = await TodoService.getColumnId(todoId);
    const todoPositions = await TodoPositionsService.getPositions(columnId);

    const todo = await TodoService.getById(todoId);

    return {
      ...todo,
      position: PositionComponent.calculatePosition(todoPositions, todo.id),
    };
  }

  async getAll(userId, boardId, columnId) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccessToBoard = await BoardAccessService.getByBoardId(userId, boardId);
      if (!isAccessToBoard) {
        throw new BackendError.Forbidden('This account is not allowed to receive todos for this board');
      }
      boardIdsWithAccess = [boardId];
    } else {
      boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);
    }

    if (!boardIdsWithAccess.length) {
      throw new BackendError.Forbidden('This account does not have access to any boards');
    }

    let todos;
    if (columnId) {
      const isAccessToColumn = await BoardAccessService.getByColumnId(userId, columnId);
      if (!isAccessToColumn) {
        throw new BackendError.Forbidden('This account is not allowed to receive todos for this column');
      }
      todos = await TodoService.getByColumnId(columnId);
    } else {
      todos = await TodoService.getByBoardIds(boardIdsWithAccess);
    }

    if (!todos.length) {
      throw new BackendError.Forbidden('This account does not have access to any todos');
    }

    if (columnId) {
      const todoPositions = await TodoPositionsService.getPositions(columnId);
      return PositionComponent.orderByPosition(todoPositions, todos);
    }

    const columnIdsMap = new Set();
    todos.forEach((todo) => {
      columnIdsMap.add(todo.columnId);
    });
    const columnIds = [...columnIdsMap];

    const todoPositionsByColumnIds = await TodoPositionsService.getPositionsByColumnIds(columnIds);

    let orderedTodos = [];

    columnIds.forEach((id) => {
      const todoPositions = todoPositionsByColumnIds.find((el) => el.columnId === id).order;
      const todosByColumn = todos.filter((todo) => todo.columnId === id);
      orderedTodos = [
        ...orderedTodos,
        ...PositionComponent.orderByPosition(todoPositions, todosByColumn),
      ];
    });

    return orderedTodos;
  }

  // TODO: write tests for updatePosition
  async updatePosition({
    columnId, sourcePosition, destinationPosition,
  }) {
    const todoPositions = await TodoPositionsService.getPositions(columnId);

    if (!PositionComponent.isValid(sourcePosition, destinationPosition, todoPositions)) {
      throw new BackendError.BadRequest('Invalid source or destination position');
    }

    const newTodoPositions = PositionComponent.move(
      todoPositions, sourcePosition, destinationPosition,
    );

    await TodoPositionsService.updatePositions(columnId, newTodoPositions);

    return destinationPosition;
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

  // TODO: write tests
  async duplicate({ userId, todoId }) {
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to duplicate this todo');
    }

    const { id, ...todoToDuplicate } = await TodoService.getById(todoId);

    const {
      todoId: newTodoId,
      position,
    } = await this.create(userId, { belowId: todoId, ...todoToDuplicate });

    return {
      ...todoToDuplicate,
      todoId: newTodoId,
      position,
    };
  }

  async remove({ userId, todoId }) {
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this todo');
    }

    const removedTodo = await TodoService.removeById(todoId);
    const { id: removedId, columnId } = removedTodo;
    const todoPositions = await TodoPositionsService.getPositions(columnId);
    const newPositions = PositionComponent.remove(todoPositions, removedId);
    await TodoPositionsService.updatePositions(columnId, newPositions);

    return true;
  }
}

module.exports = {
  TodoController: new TodoController(),
};
