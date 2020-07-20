const { BackendResponse } = require('../../components');
const { ColumnController } = require('./controller');

class ColumnAdapter {
  async create(req, res, next) {
    try {
      const { userId } = res.locals;
      const columnId = await ColumnController.create(userId, req.body);
      return BackendResponse.Created(res, 'Column successfully created', { columnId });
    } catch (e) {
      next(e);
    }
  }

  async get(req, res, next) {
    try {
      const { userId } = res.locals;
      const { columnId } = req.params;
      const column = await ColumnController.get(userId, columnId);
      return BackendResponse.Success(res, 'Column information successfully received', column);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const { userId } = res.locals;
      const { boardId } = req.query;
      const columns = await ColumnController.getAll(userId, boardId);
      return BackendResponse.Success(res, 'Columns information successfully received', { columns });
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { userId } = res.locals;
      const { columnId } = req.params;

      await ColumnController.update({
        userId,
        columnId,
        patch: req.body,
      });

      return BackendResponse.Success(res, 'Column successfully updated');
    } catch (e) {
      next(e);
    }
  }

  async remove(req, res, next) {
    try {
      const { userId } = res.locals;
      const { columnId } = req.params;

      await ColumnController.remove({
        userId,
        columnId,
      });

      return BackendResponse.Success(res, 'Column successfully removed');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  ColumnAdapter: new ColumnAdapter(),
};
