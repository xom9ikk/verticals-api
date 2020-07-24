const { ColumnService, BoardAccessService } = require('../../services');
const { BackendError } = require('../../components');

class ColumnController {
  async create(userId, column) {
    const { boardId } = column;
    const isAccess = await BoardAccessService.getByBoardId(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create column for this board');
    }

    const columnId = await ColumnService.create(column);
    return columnId;
  }

  async get(userId, columnId) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this column');
    }

    const column = await ColumnService.getById(columnId);
    return column;
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

    return columns;
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

    // TODO cascade
    await ColumnService.removeById(columnId);
    return true;
  }
}

module.exports = {
  ColumnController: new ColumnController(),
};
