const { BackendResponse } = require('../../components');
const { BoardController } = require('./controller');

class BoardAdapter {
  async create(req, res) {
    const { userId } = req;
    const board = await BoardController.create(userId, req.body);
    return BackendResponse.Created(res, 'Board successfully created', board);
  }

  async get(req, res) {
    const { userId } = req;
    const { boardId } = req.params;
    const board = await BoardController.get(userId, boardId);
    return BackendResponse.Success(res, 'Board information successfully received', board);
  }

  async getAll(req, res) {
    const { userId } = req;
    const boards = await BoardController.getAll(userId);
    return BackendResponse.Success(res, 'Boards information successfully received', { boards });
  }

  async updatePosition(req, res) {
    const { userId } = req;
    const { sourcePosition, destinationPosition } = req.body;

    await BoardController.updatePosition({
      userId,
      sourcePosition,
      destinationPosition,
    });

    return BackendResponse.Success(res, 'Board position successfully updated');
  }

  async update(req, res) {
    const { userId } = req;
    const { boardId } = req.params;

    await BoardController.update({
      userId,
      boardId,
      patch: req.body,
    });

    return BackendResponse.Success(res, 'Board successfully updated');
  }

  async reverseColumnOrder(req, res) {
    const { userId } = req;
    const { boardId } = req.body;

    await BoardController.reverseColumnOrder({
      userId,
      boardId,
    });

    return BackendResponse.Success(res, 'Columns successfully reversed');
  }

  async remove(req, res) {
    const { userId } = req;
    const { boardId } = req.params;

    await BoardController.remove({
      userId,
      boardId,
    });

    return BackendResponse.Success(res, 'Board successfully removed');
  }
}

module.exports = {
  BoardAdapter: new BoardAdapter(),
};
