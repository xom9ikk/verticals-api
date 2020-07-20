const { BackendResponse } = require('../../components');
const { CommentController } = require('./controller');

class CommentAdapter {
  async create(req, res, next) {
    try {
      const { userId } = res.locals;
      const commentId = await CommentController.create(userId, req.body);
      return BackendResponse.Created(res, 'Comment successfully created', { commentId });
    } catch (e) {
      next(e);
    }
  }

  async get(req, res, next) {
    try {
      const { userId } = res.locals;
      const { commentId } = req.params;
      const comment = await CommentController.get(userId, commentId);
      return BackendResponse.Success(res, 'Comment information successfully received', comment);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const { userId } = res.locals;
      const { boardId, columnId, todoId } = req.query;
      const comments = await CommentController.getAll(userId, boardId, columnId, todoId);
      return BackendResponse.Success(res, 'Comments information successfully received', { comments });
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { userId } = res.locals;
      const { todoId } = req.params;

      await CommentController.update({
        userId,
        todoId,
        patch: req.body,
      });

      return BackendResponse.Success(res, 'Comment successfully updated');
    } catch (e) {
      next(e);
    }
  }

  async remove(req, res, next) {
    try {
      const { userId } = res.locals;
      const { todoId } = req.params;

      await CommentController.remove({
        userId,
        todoId,
      });

      return BackendResponse.Success(res, 'Comment successfully removed');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  CommentAdapter: new CommentAdapter(),
};
