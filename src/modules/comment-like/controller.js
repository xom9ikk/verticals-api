const { CommentLikesService, BoardAccessService } = require('../../services');
const { BackendError } = require('../../components');

// TODO: tests
class CommentLikeController {
  async create({ userId, commentId }) {
    const isAccess = await BoardAccessService.getByCommentId(userId, commentId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to like this comment');
    }

    const isLikeExist = await CommentLikesService.getByUserAndCommentId(userId, commentId);

    if (isLikeExist) {
      throw new BackendError.BadRequest('This account already liked this comment');
    }

    const like = { userId, commentId };

    await CommentLikesService.create(like);

    return commentId;
  }

  async remove({ userId, commentId }) {
    const isAccess = await BoardAccessService.getByCommentId(userId, commentId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove like for this comment');
    }

    const isLikeExist = await CommentLikesService.getByUserAndCommentId(userId, commentId);

    if (!isLikeExist) {
      throw new BackendError.BadRequest('This account has no like for this comment');
    }

    await CommentLikesService.removeByUserAndCommentId(userId, commentId);
    return commentId;
  }
}

module.exports = {
  CommentLikeController: new CommentLikeController(),
};
