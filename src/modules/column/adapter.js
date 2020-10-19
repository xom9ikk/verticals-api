const { BackendResponse } = require('../../components');
const { ColumnController } = require('./controller');

class ColumnAdapter {
  async create(req, res) {
    const { userId } = req;

    const column = await ColumnController.create(userId, req.body);

    return BackendResponse.Created(res, 'Column successfully created', column);
  }

  async get(req, res) {
    const { userId } = req;
    const { columnId } = req.params;

    const column = await ColumnController.get(userId, columnId);

    return BackendResponse.Success(res, 'Column information successfully received', column);
  }

  async getAll(req, res) {
    const { userId } = req;
    const { boardId } = req.query;

    const columns = await ColumnController.getAll(userId, boardId);

    return BackendResponse.Success(res, 'Columns information successfully received', { columns });
  }

  async updatePosition(req, res) {
    const { userId } = req;
    const { boardId, sourcePosition, destinationPosition } = req.body;

    await ColumnController.updatePosition({
      userId,
      boardId,
      sourcePosition,
      destinationPosition,
    });

    return BackendResponse.Success(res, 'Column position successfully updated');
  }

  async update(req, res) {
    const { userId } = req;
    const { columnId } = req.params;

    await ColumnController.update({
      userId,
      columnId,
      patch: req.body,
    });

    return BackendResponse.Success(res, 'Column successfully updated');
  }

  async duplicate(req, res) {
    const { userId } = req;
    const { columnId } = req.body;

    const column = await ColumnController.duplicate({ userId, columnId });

    return BackendResponse.Success(res, 'Column successfully duplicated', column);
  }

  async reverseOrder(req, res) {
    const { userId } = req;
    const { boardId } = req.body;

    await ColumnController.reverseOrder({
      userId,
      boardId,
    });

    return BackendResponse.Success(res, 'Columns successfully reversed');
  }

  async remove(req, res) {
    const { userId } = req;
    const { columnId } = req.params;

    await ColumnController.remove({
      userId,
      columnId,
    });

    return BackendResponse.Success(res, 'Column successfully removed');
  }
}

module.exports = {
  ColumnAdapter: new ColumnAdapter(),
};
