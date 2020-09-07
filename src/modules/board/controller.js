const { BoardService, BoardAccessService, BoardPositionsService } = require('../../services');
const { BackendError } = require('../../components/error');
const { PositionComponent } = require('../../components');

class BoardController {
  async create(userId, { belowId, ...board }) {
    // TODO: write tests with belowId
    if (belowId) {
      const isAccessToBelowBoardId = await BoardAccessService.getByBoardId(userId, belowId);
      if (!isAccessToBelowBoardId) {
        throw new BackendError.Forbidden('This account is not allowed to create board below this board');
      }
    }

    const boardId = await BoardService.create(board);

    await BoardAccessService.create(userId, boardId);
    const boardPositions = await BoardPositionsService.getByUserId(userId);

    const {
      newPosition,
      newPositions,
    } = PositionComponent.insert(boardId, boardPositions, belowId);

    await BoardPositionsService.update(userId, newPositions);

    return { boardId, position: newPosition };
  }

  async get(userId, boardId) {
    const isAccess = await BoardAccessService.getByBoardId(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this board');
    }

    const board = await BoardService.getById(boardId);
    const boardPositions = await BoardPositionsService.getByUserId(userId);
    return {
      ...board,
      position: PositionComponent.calculatePosition(boardPositions, board.id),
    };
  }

  async getAll(userId) {
    const boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);

    if (!boardIdsWithAccess.length) {
      throw new BackendError.Forbidden('This account does not have access to any boards');
    }

    const boards = await BoardService.getByBoardIds(boardIdsWithAccess);
    const boardPositions = await BoardPositionsService.getByUserId(userId);
    return PositionComponent.orderByPosition(boards, boardPositions);
  }

  // TODO: write tests for updatePosition
  async updatePosition({ userId, sourcePosition, destinationPosition }) {
    const boardIds = await BoardAccessService.getAllBoardIdsByUserId(userId);

    const maxPosition = Math.max(sourcePosition, destinationPosition);
    const minPosition = Math.min(sourcePosition, destinationPosition);

    if (sourcePosition === destinationPosition
      || maxPosition >= boardIds.length || minPosition < 0) {
      throw new BackendError.BadRequest('Invalid source or destination position');
    }

    const boardPositions = await BoardPositionsService.getByUserId(userId);

    const newBoardPositions = PositionComponent.move(
      boardPositions, sourcePosition, destinationPosition,
    );

    await BoardPositionsService.update(userId, newBoardPositions);

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
    const { id: removedId } = removedBoard;
    const boardPositions = await BoardPositionsService.getByUserId(userId);
    const newPositions = PositionComponent.remove(boardPositions, removedId);
    await BoardPositionsService.update(userId, newPositions);

    return true;
  }
}

module.exports = {
  BoardController: new BoardController(),
};
