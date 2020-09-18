const { ColumnService, BoardAccessService, ColumnPositionsService } = require('../../services');
const { BackendError } = require('../../components/error');
const { PositionComponent } = require('../../components');

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
    if (columnPositions.length === 0) {
      await ColumnPositionsService.create(boardId, []);
    }

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

    const columnPositions = await ColumnPositionsService.getPositions(boardId);
    return PositionComponent.orderByPosition(columnPositions, columns);
  }

  // TODO: write tests for updatePosition
  async updatePosition({
    boardId, sourcePosition, destinationPosition,
  }) {
    const columnPositions = await ColumnPositionsService.getPositions(boardId);

    if (!PositionComponent.isValid(sourcePosition, destinationPosition, columnPositions)) {
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

    return {
      ...columnToDuplicate,
      columnId: newColumnId,
      position,
    };
  }

  async remove({ userId, columnId }) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this column');
    }

    const removedColumn = await ColumnService.removeById(columnId);
    const { id: removedId, boardId } = removedColumn;
    const columnPositions = await ColumnPositionsService.getPositions(boardId);
    const newPositions = PositionComponent.remove(columnPositions, removedId);
    await ColumnPositionsService.updatePositions(boardId, newPositions);

    return true;
  }
}

module.exports = {
  ColumnController: new ColumnController(),
};
