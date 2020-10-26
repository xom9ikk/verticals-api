const { BoardAccessService, CommentFilesService } = require('../../services');
const { BackendError, FileComponent, TransformerComponent } = require('../../components');

class CommentAttachmentController {
  async save({ userId, commentId, file }) {
    const isAccess = await BoardAccessService.getByCommentId(userId, commentId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to attach files to this comment');
    }

    const savedFile = await FileComponent.saveFile(FileComponent.folders.comments, file);

    const attachmentId = await CommentFilesService.create({
      ...savedFile,
      commentId,
    });

    return {
      ...savedFile,
      commentId,
      path: TransformerComponent.transformLink(savedFile.path),
      id: attachmentId,
    };
  }

  // TODO: tests
  async getAll({
    userId, boardId, columnId, todoId,
  }) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccessToBoard = await BoardAccessService.getByBoardId(userId, boardId);
      if (!isAccessToBoard) {
        throw new BackendError.Forbidden('This account is not allowed to receive attachments for this board');
      }
      boardIdsWithAccess = [boardId];
    } else {
      boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);
    }

    if (!boardIdsWithAccess.length) {
      throw new BackendError.Forbidden('This account does not have access to any boards');
    }

    let attachments;
    if (todoId) {
      const isAccessToTodo = await BoardAccessService.getByTodoId(userId, todoId);
      if (!isAccessToTodo) {
        throw new BackendError.Forbidden('This account is not allowed to receive attachments for this todo');
      }
      attachments = await CommentFilesService.getByTodoId(todoId);
    } else if (columnId) {
      const isAccessToColumn = await BoardAccessService.getByColumnId(userId, columnId);
      if (!isAccessToColumn) {
        throw new BackendError.Forbidden('This account is not allowed to receive attachments for this column');
      }
      attachments = await CommentFilesService.getByColumnId(columnId);
    } else {
      attachments = await CommentFilesService.getByBoardIds(boardIdsWithAccess);
    }

    return attachments.map((attachment) => ({
      ...attachment,
      path: TransformerComponent.transformLink(attachment.path),
    }));
  }

  async remove({ userId, attachmentId }) {
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
