const { SUB_TODO_ON_TOP } = require('../../constants');
const {
  SubTodoService, TodoService, BoardAccessService, SubTodoPositionsService,
} = require('../../services');
const { BackendError } = require('../../components/error');
const { PositionComponent } = require('../../components');

// TODO: write tests
class SubTodoController {
  async create(userId, { belowId, ...subTodo }) {
    if (belowId) {
      if (belowId !== SUB_TODO_ON_TOP) {
        const isAccessToBelowSubTodoId = await BoardAccessService.getBySubTodoId(userId, belowId);
        if (!isAccessToBelowSubTodoId) {
          throw new BackendError.Forbidden('This account is not allowed to create subtodo below this subtodo');
        }
      }
    }

    const { todoId } = subTodo;
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create subTodo for this todo');
    }

    const subTodoId = await SubTodoService.create(subTodo);
    const subTodoPositions = await SubTodoPositionsService.getPositions(todoId);

    let newPosition; let
      newPositions;

    if (belowId === SUB_TODO_ON_TOP) {
      newPosition = 0;
      newPositions = [subTodoId, ...subTodoPositions];
    } else {
      const moveResult = PositionComponent.insert(subTodoPositions, subTodoId, belowId);
      newPosition = moveResult.newPosition;
      newPositions = moveResult.newPositions;
    }

    await SubTodoPositionsService.updatePositions(todoId, newPositions);

    return { subTodoId, position: newPosition };
  }

  async get(userId, subTodoId) {
    const isAccess = await BoardAccessService.getBySubTodoId(userId, subTodoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this subtodo');
    }

    const todoId = await SubTodoService.getTodoId(subTodoId);
    const subTodoPositions = await SubTodoPositionsService.getPositions(todoId);

    const subTodo = await SubTodoService.getById(subTodoId);

    return {
      ...subTodo,
      position: PositionComponent.getPositionById(subTodoPositions, subTodo.id),
    };
  }

  async getAll(userId, boardId, columnId) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccessToBoard = await BoardAccessService.getByBoardId(userId, boardId);
      if (!isAccessToBoard) {
        throw new BackendError.Forbidden('This account is not allowed to receive subtodos for this board');
      }
      boardIdsWithAccess = [boardId];
    } else {
      boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);
    }

    if (!boardIdsWithAccess.length) {
      return {
        entities: [],
        positions: {},
      };
    }

    let subTodos;
    if (columnId) {
      const isAccessToColumn = await BoardAccessService.getByColumnId(userId, columnId);
      if (!isAccessToColumn) {
        throw new BackendError.Forbidden('This account is not allowed to receive subtodos for this column');
      }
      subTodos = await SubTodoService.getByColumnId(columnId);
    } else {
      subTodos = await SubTodoService.getByBoardIds(boardIdsWithAccess);
    }

    if (!subTodos.length) {
      return {
        entities: [],
        positions: {},
      };
    }

    let todos;
    if (columnId) {
      todos = await TodoService.getByColumnId(columnId);
    } else {
      todos = await TodoService.getByBoardIds(boardIdsWithAccess);
    }

    const todoIdsMap = new Set();

    todos.forEach((todo) => {
      todoIdsMap.add(todo.id);
    });
    const todoIds = [...todoIdsMap];

    const subTodoPositionsByTodoIds = await SubTodoPositionsService.getPositionsByTodoIds(todoIds);

    const normalizedPositions = subTodoPositionsByTodoIds.reduce((acc, { todoId: id, order }) => ({
      ...acc,
      [id]: order,
    }), {});

    return {
      entities: subTodos,
      positions: normalizedPositions,
    };
  }

  async updatePosition({
    userId, todoId, sourcePosition, destinationPosition, targetTodoId,
  }) {
    const isAccessToSourceTodo = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccessToSourceTodo) {
      throw new BackendError.Forbidden('This account does not have access to source todo');
    }

    const subTodoPositions = await SubTodoPositionsService.getPositions(todoId);

    if (targetTodoId) {
      const isAccessToTargetTodo = await BoardAccessService.getByTodoId(
        userId, targetTodoId,
      );

      if (!isAccessToTargetTodo) {
        throw new BackendError.Forbidden('This account does not have access to target todo');
      }

      const targetSubTodoPositions = await SubTodoPositionsService.getPositions(targetTodoId);

      if (!PositionComponent.isValidSource(subTodoPositions, sourcePosition)
        || !PositionComponent.isValidDestination(targetSubTodoPositions, destinationPosition)) {
        throw new BackendError.BadRequest('Invalid source or destination position');
      }

      const subTodoId = subTodoPositions[sourcePosition];
      await SubTodoService.update(subTodoId, { todoId: targetTodoId });
      const newTargetSubTodoPositions = PositionComponent.insertInPosition(
        targetSubTodoPositions, destinationPosition, subTodoId,
      );
      await SubTodoPositionsService.updatePositions(targetTodoId, newTargetSubTodoPositions);

      const newSourceSubTodoPositions = PositionComponent.removeByPosition(
        subTodoPositions, sourcePosition,
      );
      await SubTodoPositionsService.updatePositions(todoId, newSourceSubTodoPositions);
    } else {
      if (!PositionComponent.isValidSource(subTodoPositions, sourcePosition, destinationPosition)) {
        throw new BackendError.BadRequest('Invalid source or destination position');
      }

      const newSubTodoPositions = PositionComponent.move(
        subTodoPositions, sourcePosition, destinationPosition,
      );

      await SubTodoPositionsService.updatePositions(todoId, newSubTodoPositions);
    }

    return destinationPosition;
  }

  async update({ userId, subTodoId, patch }) {
    const isAccess = await BoardAccessService.getBySubTodoId(userId, subTodoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this subtodo');
    }

    const { todoId: newTodoId } = patch;

    if (newTodoId) {
      const isAccessToNewTodo = await BoardAccessService.getByTodoId(userId, newTodoId);
      if (!isAccessToNewTodo) {
        throw new BackendError.Forbidden('This account is not allowed to set this todoId for this subtodo');
      }
    }

    await SubTodoService.update(subTodoId, patch);

    return true;
  }

  async duplicate({ userId, subTodoId, newTodoId }) {
    const isAccess = await BoardAccessService.getBySubTodoId(userId, subTodoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to duplicate this subtodo');
    }

    const { id, expirationDate, ...subTodoToDuplicate } = await SubTodoService.getById(subTodoId);

    const dataForCreate = newTodoId !== undefined ? {
      ...subTodoToDuplicate,
      expirationDate: new Date(expirationDate),
      todoId: newTodoId,
    } : {
      ...subTodoToDuplicate,
      expirationDate: new Date(expirationDate),
      belowId: subTodoId,
    };

    const {
      subTodoId: newSubTodoId,
      position,
    } = await this.create(userId, dataForCreate);

    return {
      ...subTodoToDuplicate,
      subTodoId: newSubTodoId,
      position,
    };
  }

  async remove({ userId, subTodoId }) {
    const isAccess = await BoardAccessService.getBySubTodoId(userId, subTodoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this subtodo');
    }

    const removedSubTodo = await SubTodoService.removeById(subTodoId);
    const { id: removedId, todoId } = removedSubTodo;
    const subTodoPositions = await SubTodoPositionsService.getPositions(todoId);
    const newPositions = PositionComponent.removeById(subTodoPositions, removedId);
    await SubTodoPositionsService.updatePositions(todoId, newPositions);

    return true;
  }
}

module.exports = {
  SubTodoController: new SubTodoController(),
};
