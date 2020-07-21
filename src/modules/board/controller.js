const { BoardService, BoardAccessService } = require('../../services');
const { BackendError } = require('../../components');

class BoardController {
  async create(userId, board) {
    const boardId = await BoardService.create(board);
    await BoardAccessService.create(userId, boardId);
    return boardId;
  }

  async get(userId, boardId) {
    const isAccess = await BoardAccessService.getByBoardId(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this board');
    }

    const board = await BoardService.getById(boardId);
    return board;
  }

  async getAll(userId) {
    const boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);

    if (!boardIdsWithAccess.length) {
      throw new BackendError.Forbidden('This account does not have access to any boards');
    }

    const boards = await BoardService.getByBoardIds(boardIdsWithAccess);
    return boards;
  }

  async update({ userId, boardId, patch }) {
    const isAccess = await BoardAccessService.getByBoardId(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this board');
    }

    await BoardService.update(boardId, patch);
    return true;
  }

  async remove({ userId, boardId }) {
    const isAccess = await BoardAccessService.getByBoardId(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this board');
    }

    // TODO cascade
    await BoardAccessService.removeByBoardId(boardId);
    await BoardService.removeById(boardId);
    return true;
  }
}

module.exports = {
  BoardController: new BoardController(),
};
