const { ColumnService, BoardAccessService } = require('../../services');
const { BackendError } = require('../../components');

class ColumnController {
  async create(userId, column) {
    const { boardId } = column;
    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create column for this board');
    }

    const columnId = await ColumnService.create(column);
    return columnId;
  }

  async get(userId, columnId) {
    const boardId = await ColumnService.getBoardIdByColumnId(columnId);

    if (boardId === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to receive this column');
    }

    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this column');
    }

    const column = await ColumnService.getById(columnId);
    return column;
  }

  async getAll(userId, boardId) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccess = await BoardAccessService.get(userId, boardId);
      if (!isAccess) {
        throw new BackendError.Forbidden('This account is not allowed to receive columns for this board');
      }
      boardIdsWithAccess = [boardId];
    } else {
      boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);
    }

    if (!boardIdsWithAccess.length) {
      throw new BackendError.Forbidden('This account does not have access to any columns');
    }

    const columns = await ColumnService.getByBoardIds(boardIdsWithAccess);

    if (!columns.length) {
      throw new BackendError.Forbidden('This account does not have access to any columns');
    }

    return columns;
  }

  async update({ userId, columnId, patch }) {
    const { boardId } = patch;
    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this column');
    }

    const updatedColumn = await ColumnService.update(columnId, patch);

    if (updatedColumn === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to edit this column');
    }

    return true;
  }

  async remove({ userId, columnId }) {
    const boardId = await ColumnService.getBoardIdByColumnId(columnId);

    if (boardId === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to remove this column');
    }

    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this column');
    }

    await BoardAccessService.removeByBoardId(columnId);
    await ColumnService.removeById(columnId);
    return true;
  }
}

module.exports = {
  ColumnController: new ColumnController(),
};
