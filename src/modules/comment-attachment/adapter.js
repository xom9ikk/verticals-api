const { BackendResponse } = require('../../components');
const { CommentAttachmentController } = require('./controller');

class CommentAttachmentAdapter {
  async save(req, res) {
    const { commentId } = req.params;
    const { userId, file } = req;
    const savedFile = await CommentAttachmentController.save({ userId, commentId, file });
    return BackendResponse.Created(res, 'Successfully uploaded attachment for comment', savedFile);
  }

  async getAll(req, res) {
    const { userId } = req;
    const { boardId, columnId, todoId } = req.query;
    const attachments = await CommentAttachmentController.getAll({
      userId, boardId, columnId, todoId,
    });
    return BackendResponse.Success(res, 'Attachments successfully received', { attachments });
  }

  async remove(req, res) {
    const { attachmentId } = req.params;
    const { userId } = req;
    await CommentAttachmentController.remove({ userId, attachmentId });
    return BackendResponse.Success(res, 'Attachment successfully removed', { attachmentId });
  }
}

module.exports = {
  CommentAttachmentAdapter: new CommentAttachmentAdapter(),
};
