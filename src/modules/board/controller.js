const { BoardService, BoardAccessService } = require('../../services');
const { BackendError } = require('../../components');

class BoardController {
  async create(userId, board) {
    const boardId = await BoardService.create(board);
    await BoardAccessService.create(userId, boardId);
    return boardId;
  }

  async update({ userId, boardId, patch }) {
    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this board');
    }

    await BoardService.update(boardId, patch);
    return true;
  }

  async remove({ userId, boardId }) {
    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this board');
    }

    await BoardAccessService.removeByBoardId(boardId);
    await BoardService.removeById(boardId);
    return true;
  }
}

module.exports = {
  BoardController: new BoardController(),
};
