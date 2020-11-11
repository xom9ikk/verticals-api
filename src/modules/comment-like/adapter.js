const { BackendResponse } = require('../../components');
const { CommentLikeController } = require('./controller');

class CommentLikeAdapter {
  async create(req, res) {
    const { userId } = req;
    const { commentId } = req.body;

    const like = await CommentLikeController.create({ userId, commentId });

    return BackendResponse.Created(res, 'Comment was liked successfully', like);
  }

  async remove(req, res) {
    const { userId } = req;
    const { commentId } = req.params;

    const like = await CommentLikeController.remove({ userId, commentId });

    return BackendResponse.Success(res, 'Comment was unliked successfully', like);
  }
}

module.exports = {
  CommentLikeAdapter: new CommentLikeAdapter(),
};
