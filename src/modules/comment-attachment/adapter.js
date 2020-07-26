const { BackendResponse } = require('../../components');
const { CommentController } = require('./controller');

class CommentAttachmentAdapter {
  async create(req, res, next) {
    try {
      const { userId } = res.locals;
      const commentId = await CommentController.create({ userId, comment: req.body });
      return BackendResponse.Created(res, 'Comment successfully created', { commentId });
    } catch (e) {
      next(e);
    }
  }

  async get(req, res, next) {
    try {
      const { userId } = res.locals;
      const { commentId } = req.params;
      const comment = await CommentController.get({ userId, commentId });
      return BackendResponse.Success(res, 'Comment information successfully received', comment);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const { userId } = res.locals;
      const { boardId, columnId, todoId } = req.query;
      const comments = await CommentController.getAll({
        userId, boardId, columnId, todoId,
      });
      return BackendResponse.Success(res, 'Comments information successfully received', { comments });
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { userId } = res.locals;
      const { commentId } = req.params;

      await CommentController.update({
        userId,
        commentId,
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
      const { commentId } = req.params;

      await CommentController.remove({
        userId,
        commentId,
      });

      return BackendResponse.Success(res, 'Comment successfully removed');
    } catch (e) {
      next(e);
    }
  }

  async saveAttachment(req, res, next) {
    try {
      const { commentId } = req.params;
      const { userId, file } = res.locals;
      const savedFile = await CommentController.saveAttachment({ userId, commentId, file });
      return BackendResponse.Created(res, 'Successfully uploaded attachment for comment', { file: savedFile });
    } catch (e) {
      next(e);
    }
  }

  async removeAttachment(req, res, next) {
    try {
      const { attachmentId } = req.params;
      const { userId } = res.locals;
      await CommentController.removeAttachment({ userId, attachmentId });
      return BackendResponse.Success(res, 'Attachment successfully removed', { attachmentId });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  CommentAttachmentAdapter: new CommentAttachmentAdapter(),
};
