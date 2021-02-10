/* eslint-disable */
const {
  ColumnService, BoardAccessService, ColumnPositionsService, TodoPositionsService, TodoService,
} = require('../../services');
const { BackendError } = require('../../components/error');
const { PositionComponent } = require('../../components');
const { TodoController } = require('../todo/controller');

class ColumnController {
  async create(userId, { belowId, ...column }) {
    // TODO: write tests with belowId
    if (belowId) {
      const isAccessToBelowColumnId = await BoardAccessService.getByColumnId(userId, belowId);
      if (!isAccessToBelowColumnId) {
        throw new BackendError.Forbidden('This account is not allowed to create column below this column');
      }
    }

    const { boardId } = column;
    const isAccess = await BoardAccessService.getByBoardId(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create column for this board');
    }

    const columnId = await ColumnService.create(column);
    const columnPositions = await ColumnPositionsService.getPositions(boardId);
    await TodoPositionsService.create(columnId, []);

    const {
      newPosition,
      newPositions,
    } = PositionComponent.insert(columnPositions, columnId, belowId);

    await ColumnPositionsService.updatePositions(boardId, newPositions);

    return { columnId, position: newPosition };
  }

  async get(userId, columnId) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this column');
    }

    const boardId = await ColumnService.getBoardId(columnId);

    const columnPositions = await ColumnPositionsService.getPositions(boardId);

    const column = await ColumnService.getById(columnId);

    return {
      ...column,
      position: PositionComponent.getPositionById(columnPositions, column.id),
    };
  }

  async getAll(userId, boardId) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccessToBoard = await BoardAccessService.getByBoardId(userId, boardId);
      if (!isAccessToBoard) {
        throw new BackendError.Forbidden('This account is not allowed to receive columns for this board');
      }
      boardIdsWithAccess = [boardId];
    } else {
      boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);
    }

    if (!boardIdsWithAccess.length) {
      throw new BackendError.Forbidden('This account does not have access to any baords');
    }

    const columns = await ColumnService.getByBoardIds(boardIdsWithAccess);

    if (boardId) {
      const columnPositions = await ColumnPositionsService.getPositions(boardId);
      return {
        entities: columns,
        positions: {
          [boardId]: columnPositions,
        }
      }
    }

    const columnPositions = await ColumnPositionsService.getPositionsByBoardIds(boardIdsWithAccess);

    const normalizedPositions = columnPositions.reduce((acc, { boardId, order }) => {
      return {
        ...acc,
        [boardId]: order
      };
    }, {});

    return {
      entities: columns,
      positions: normalizedPositions
    }
  }

  // TODO: write tests for updatePosition
  async updatePosition({
    userId, boardId, sourcePosition, destinationPosition,
  }) {
    const isAccess = await BoardAccessService.getByBoardId(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this column');
    }

    const columnPositions = await ColumnPositionsService.getPositions(boardId);

    if (!PositionComponent.isValidSource(columnPositions, sourcePosition, destinationPosition)) {
      throw new BackendError.BadRequest('Invalid source or destination position');
    }

    const newColumnPositions = PositionComponent.move(
      columnPositions, sourcePosition, destinationPosition,
    );

    await ColumnPositionsService.updatePositions(boardId, newColumnPositions);

    return destinationPosition;
  }

  async update({ userId, columnId, patch }) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this column');
    }

    const { boardId: newBoardId } = patch;
    if (newBoardId) {
      const isAccessToNewBoard = await BoardAccessService.getByBoardId(userId, newBoardId);
      if (!isAccessToNewBoard) {
        throw new BackendError.Forbidden('This account is not allowed to set this boardId for this column');
      }
    }

    const updatedColumn = await ColumnService.update(columnId, patch);

    if (updatedColumn === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to edit this column');
    }

    return true;
  }

  // TODO: write tests
  async duplicate({ userId, columnId }) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to duplicate this column');
    }

    const { id, ...columnToDuplicate } = await ColumnService.getById(columnId);

    const {
      columnId: newColumnId,
      position,
    } = await this.create(userId, { belowId: columnId, ...columnToDuplicate });

    const todos = await TodoService.getByColumnId(columnId);

    const todosToDuplicate = todos.map((todo) => {
      const newTodo = { ...todo, columnId: newColumnId };
      delete newTodo.id;
      return newTodo;
    });

    for await (const todo of todosToDuplicate) {
      await TodoController.create(userId, todo);
    }

    const duplicatedTodos = await TodoController.getAll(userId, undefined, newColumnId);

    return {
      ...columnToDuplicate,
      columnId: newColumnId,
      position,
      todos: duplicatedTodos,
    };
  }

  // TODO: write tests for reverseOrder
  async reverseOrder({ userId, boardId }) {
    const isAccess = await BoardAccessService.getByBoardId(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to reverse columns in this board');
    }

    const columnPositions = await ColumnPositionsService.getPositions(boardId);

    const newColumnPositions = PositionComponent.reverse(columnPositions);

    await ColumnPositionsService.updatePositions(boardId, newColumnPositions);

    return true;
  }

  async remove({ userId, columnId }) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this column');
    }

    const removedColumn = await ColumnService.removeById(columnId);
    const { id: removedId, boardId } = removedColumn;
    const columnPositions = await ColumnPositionsService.getPositions(boardId);
    const newPositions = PositionComponent.removeById(columnPositions, removedId);
    await ColumnPositionsService.updatePositions(boardId, newPositions);

    return true;
  }
}

module.exports = {
  ColumnController: new ColumnController(),
};
