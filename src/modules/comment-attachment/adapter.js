const { BackendResponse } = require('../../components');
const { CommentAttachmentController } = require('./controller');

class CommentAttachmentAdapter {
  async create(req, res) {
    const { userId } = req;
    const commentId = await CommentAttachmentController.create({ userId, comment: req.body });
    return BackendResponse.Created(res, 'Comment successfully created', { commentId });
  }

  async get(req, res) {
    const { userId } = req;
    const { commentId } = req.params;
    const comment = await CommentAttachmentController.get({ userId, commentId });
    return BackendResponse.Success(res, 'Comment information successfully received', comment);
  }

  async getAll(req, res) {
    const { userId } = req;
    const { boardId, columnId, todoId } = req.query;
    const comments = await CommentAttachmentController.getAll({
      userId, boardId, columnId, todoId,
    });
    return BackendResponse.Success(res, 'Comments information successfully received', { comments });
  }

  async update(req, res) {
    const { userId } = req;
    const { commentId } = req.params;

    await CommentAttachmentController.update({
      userId,
      commentId,
      patch: req.body,
    });

    return BackendResponse.Success(res, 'Comment successfully updated');
  }

  async remove(req, res) {
    const { userId } = req;
    const { commentId } = req.params;

    await CommentAttachmentController.remove({
      userId,
      commentId,
    });

    return BackendResponse.Success(res, 'Comment successfully removed');
  }

  async saveAttachment(req, res) {
    const { commentId } = req.params;
    const { userId, file } = req;
    const savedFile = await CommentAttachmentController.saveAttachment({ userId, commentId, file });
    return BackendResponse.Created(res, 'Successfully uploaded attachment for comment', savedFile);
  }

  async removeAttachment(req, res) {
    const { attachmentId } = req.params;
    const { userId } = req;
    await CommentAttachmentController.removeAttachment({ userId, attachmentId });
    return BackendResponse.Success(res, 'Attachment successfully removed', { attachmentId });
  }
}

module.exports = {
  CommentAttachmentAdapter: new CommentAttachmentAdapter(),
};
