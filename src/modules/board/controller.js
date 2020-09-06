const { BoardService, BoardAccessService } = require('../../services');
const { BackendError } = require('../../components/error');

class BoardController {
  async create(userId, { belowId, ...board }) {
    // TODO: write tests with belowId
    if (belowId) {
      const isAccessToBelowBoardId = await BoardAccessService.getByBoardId(userId, belowId);
      if (!isAccessToBelowBoardId) {
        throw new BackendError.Forbidden('This account is not allowed to create board below this board');
      }
    }

    const boardIds = await BoardAccessService.getAllBoardIdsByUserId(userId);
    const position = boardIds.length;
    const boardId = await BoardService.create({
      ...board,
      position,
    });

    await BoardAccessService.create(userId, boardId);

    if (belowId) {
      const belowBoard = await BoardService.getById(belowId);
      const destinationPosition = belowBoard.position + 1;
      if (position !== destinationPosition) {
        const newPosition = await this.updatePosition({
          userId,
          sourcePosition: position,
          destinationPosition,
        });
        return { boardId, position: newPosition };
      }
    }

    return { boardId, position };
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

  // TODO: write tests for updatePosition
  async updatePosition({ userId, sourcePosition, destinationPosition }) {
    const boardIds = await BoardAccessService.getAllBoardIdsByUserId(userId);
    const boards = await BoardService.getByBoardIds(boardIds);

    const maxPosition = Math.max(sourcePosition, destinationPosition);
    const minPosition = Math.min(sourcePosition, destinationPosition);

    if (sourcePosition === destinationPosition
      || maxPosition >= boardIds.length || minPosition < 0) {
      throw new BackendError.BadRequest('Invalid source or destination position');
    }

    const updates = [];

    boards.forEach((board) => {
      const currentPosition = board.position;
      let newPosition;

      if (sourcePosition < destinationPosition) {
        if (currentPosition === sourcePosition) {
          newPosition = destinationPosition;
        } else if (currentPosition > sourcePosition && currentPosition <= destinationPosition) {
          newPosition = currentPosition - 1;
        }
      } else if (sourcePosition > destinationPosition) {
        if (currentPosition === sourcePosition) {
          newPosition = destinationPosition;
        } else if (currentPosition < sourcePosition && currentPosition >= destinationPosition) {
          newPosition = currentPosition + 1;
        }
      }

      if (newPosition !== undefined) {
        updates.push(BoardService.update(board.id, {
          position: newPosition,
        }));
      }
    });

    await Promise.all(updates);

    return destinationPosition;
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
    const boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);

    const isAccess = boardIdsWithAccess.includes(boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this board');
    }

    const removedBoard = await BoardService.removeById(boardId);
    const { position } = removedBoard;

    await BoardService.decreaseAfterPosition(boardIdsWithAccess, position);

    return true;
  }
}

module.exports = {
  BoardController: new BoardController(),
};
