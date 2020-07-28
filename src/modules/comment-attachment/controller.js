const { FileComponent } = require('../../components/file');
const { BoardAccessService, CommentFilesService } = require('../../services');
const { BackendError } = require('../../components');

class CommentAttachmentController {
  async saveAttachment({ userId, commentId, file }) {
    const isAccess = await BoardAccessService.getByCommentId(userId, commentId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to attach files to this comment');
    }

    const savedFile = await FileComponent.saveCommentAttachment(file);

    const attachmentId = await CommentFilesService.create({
      ...savedFile,
      commentId,
    });

    return {
      ...savedFile,
      id: attachmentId,
    };
  }

  async removeAttachment({ userId, attachmentId }) {
    const isAccess = await BoardAccessService.getByAttachmentId(userId, attachmentId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove files for this comment');
    }

    await CommentFilesService.removeById(attachmentId);

    return true;
  }
}

module.exports = {
  CommentAttachmentController: new CommentAttachmentController(),
};
