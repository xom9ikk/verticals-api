const { BackendResponse } = require('../../components');
const { BoardController } = require('./controller');

class BoardAdapter {
  async create(req, res, next) {
    try {
      const { userId } = res.locals;
      const boardId = await BoardController.create(userId, req.body);
      return BackendResponse.Created(res, 'Board successfully created', { boardId });
    } catch (e) {
      next(e);
    }
  }

  async get(req, res, next) {
    try {
      const { userId } = res.locals;
      const { boardId } = req.params;
      const board = await BoardController.get(userId, boardId);
      return BackendResponse.Success(res, 'Board information successfully received', board);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const { userId } = res.locals;
      const boards = await BoardController.getAll(userId);
      return BackendResponse.Success(res, 'Boards information successfully received', { boards });
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { userId } = res.locals;
      const { boardId } = req.params;

      await BoardController.update({
        userId,
        boardId,
        patch: req.body,
      });

      return BackendResponse.Success(res, 'Board successfully updated');
    } catch (e) {
      next(e);
    }
  }

  async remove(req, res, next) {
    try {
      const { userId } = res.locals;
      const { boardId } = req.params;

      await BoardController.remove({
        userId,
        boardId,
      });

      return BackendResponse.Success(res, 'Board successfully removed');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  BoardAdapter: new BoardAdapter(),
};
