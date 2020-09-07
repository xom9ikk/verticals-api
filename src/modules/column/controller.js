const { ColumnService, BoardAccessService, PositionsService } = require('../../services');
const { BackendError } = require('../../components/error');
const { PositionComponent } = require('../../components');

class ColumnController {
  async create(userId, { belowId, ...column }) {
    // TODO: write tests with belowId
    if (belowId) {
      const isAccessToBelowBoardId = await BoardAccessService.getByColumnId(userId, belowId);
      if (!isAccessToBelowBoardId) {
        throw new BackendError.Forbidden('This account is not allowed to create column below this column');
      }
    }

    const { boardId } = column;
    const isAccess = await BoardAccessService.getByBoardId(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create column for this board');
    }

    const columnId = await ColumnService.create(column);
    const columnPositions = await PositionsService.getColumnPositions(userId);

    const {
      newPosition,
      newPositions,
    } = PositionComponent.insert(columnPositions, columnId, belowId);

    await PositionsService.updateColumnPositions(userId, newPositions);

    return { columnId, position: newPosition };
  }

  async get(userId, columnId) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this column');
    }

    const column = await ColumnService.getById(columnId);
    const columnPositions = await PositionsService.getColumnPositions(userId);
    return {
      ...column,
      position: PositionComponent.calculatePosition(columnPositions, column.id),
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

    if (!columns.length) {
      throw new BackendError.Forbidden('This account does not have access to any columns');
    }

    const columnPositions = await PositionsService.getColumnPositions(userId);
    return PositionComponent.orderByPosition(columnPositions, columns);
  }

  // TODO: write tests for updatePosition
  async updatePosition({ userId, sourcePosition, destinationPosition }) {
    const columnPositions = await PositionsService.getColumnPositions(userId);

    if (!PositionComponent.isValid(sourcePosition, destinationPosition, columnPositions)) {
      throw new BackendError.BadRequest('Invalid source or destination position');
    }

    const newColumnPositions = PositionComponent.move(
      columnPositions, sourcePosition, destinationPosition,
    );

    await PositionsService.updateColumnPositions(userId, newColumnPositions);

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

  async remove({ userId, columnId }) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this column');
    }

    const removedColumn = await ColumnService.removeById(columnId);
    const { id: removedId } = removedColumn;
    const columnPositions = await PositionsService.getColumnPositions(userId);
    const newPositions = PositionComponent.remove(columnPositions, removedId);
    await PositionsService.updateColumnPositions(userId, newPositions);

    return true;
  }
}

module.exports = {
  ColumnController: new ColumnController(),
};
