const { BackendResponse } = require('../../components');
const { CommentController } = require('./controller');

class CommentAdapter {
  async create(req, res) {
    const { userId } = req;
    const commentId = await CommentController.create({ userId, comment: req.body });
    return BackendResponse.Created(res, 'Comment successfully created', { commentId });
  }

  async get(req, res) {
    const { userId } = req;
    const { commentId } = req.params;
    const comment = await CommentController.get({ userId, commentId });
    return BackendResponse.Success(res, 'Comment information successfully received', comment);
  }

  async getAll(req, res) {
    const { userId } = req;
    const { boardId, columnId, todoId } = req.query;
    const comments = await CommentController.getAll({
      userId, boardId, columnId, todoId,
    });
    return BackendResponse.Success(res, 'Comments information successfully received', { comments });
  }

  async update(req, res) {
    const { userId } = req;
    const { commentId } = req.params;

    await CommentController.update({
      userId,
      commentId,
      patch: req.body,
    });

    return BackendResponse.Success(res, 'Comment successfully updated');
  }

  async remove(req, res) {
    const { userId } = req;
    const { commentId } = req.params;

    await CommentController.remove({
      userId,
      commentId,
    });

    return BackendResponse.Success(res, 'Comment successfully removed');
  }
}

module.exports = {
  CommentAdapter: new CommentAdapter(),
};
