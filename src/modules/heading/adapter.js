const { BackendResponse } = require('../../components');
const { HeadingController } = require('./controller');

class HeadingAdapter {
  async create(req, res) {
    const { userId } = req;

    const heading = await HeadingController.create(userId, req.body);

    return BackendResponse.Created(res, 'Heading successfully created', heading);
  }

  async get(req, res) {
    const { userId } = req;
    const { headingId } = req.params;

    const heading = await HeadingController.get(userId, headingId);

    return BackendResponse.Success(res, 'Heading information successfully received', heading);
  }

  async getAll(req, res) {
    const { userId } = req;
    const { boardId, columnId } = req.query;

    const headings = await HeadingController.getAll(userId, boardId, columnId);

    return BackendResponse.Success(res, 'Headings information successfully received', { headings });
  }

  async updatePosition(req, res) {
    const { userId } = req;
    const {
      columnId, sourcePosition, destinationPosition, targetColumnId,
    } = req.body;

    await HeadingController.updatePosition({
      userId,
      columnId,
      sourcePosition,
      destinationPosition,
      targetColumnId,
    });

    return BackendResponse.Success(res, 'Heading position successfully updated');
  }

  async update(req, res) {
    const { userId } = req;
    const { headingId } = req.params;

    await HeadingController.update({
      userId,
      headingId,
      patch: req.body,
    });

    return BackendResponse.Success(res, 'Heading successfully updated');
  }

  async duplicate(req, res) {
    const { userId } = req;
    const { headingId } = req.body;

    const heading = await HeadingController.duplicate({ userId, headingId });

    return BackendResponse.Success(res, 'Heading successfully duplicated', heading);
  }

  async remove(req, res) {
    const { userId } = req;
    const { headingId } = req.params;

    await HeadingController.remove({
      userId,
      headingId,
    });

    return BackendResponse.Success(res, 'Heading successfully removed');
  }
}

module.exports = {
  HeadingAdapter: new HeadingAdapter(),
};
