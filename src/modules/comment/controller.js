const { CommentService, BoardAccessService } = require('../../services');
const { BackendError } = require('../../components');

class CommentController {
  async create({ userId, comment }) {
    const { todoId } = comment;
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create comment for this todo');
    }

    const commentId = await CommentService.create(comment);
    return commentId;
  }

  async get({ userId, commentId }) {
    const isAccess = await BoardAccessService.getByCommentId(userId, commentId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this comment');
    }

    const comment = await CommentService.getById(commentId);
    return comment;
  }

  async getAll({
    userId, boardId, columnId, todoId,
  }) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccessToBoard = await BoardAccessService.getByBoardId(userId, boardId);
      if (!isAccessToBoard) {
        throw new BackendError.Forbidden('1This account is not allowed to receive comments for this board');
      }
      boardIdsWithAccess = [boardId];
    } else {
      boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);
    }

    if (!boardIdsWithAccess.length) {
      throw new BackendError.Forbidden('2This account does not have access to any boards');
    }

    let comments;
    if (todoId) {
      const isAccessToTodo = await BoardAccessService.getByTodoId(userId, todoId);
      if (!isAccessToTodo) {
        throw new BackendError.Forbidden('This account is not allowed to receive comments for this todo');
      }
      comments = await CommentService.getByTodoId(todoId);
    } else if (columnId) {
      const isAccessToColumn = await BoardAccessService.getByColumnId(userId, columnId);
      if (!isAccessToColumn) {
        throw new BackendError.Forbidden('This account is not allowed to receive comments for this column');
      }
      comments = await CommentService.getByColumnId(columnId);
    } else {
      comments = await CommentService.getByBoardIds(boardIdsWithAccess);
    }

    return comments;
  }

  async update({ userId, commentId, patch }) {
    const isAccess = await BoardAccessService.getByCommentId(userId, commentId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this comment');
    }

    const { todoId: newTodoId } = patch;

    if (newTodoId) {
      const isAccessToNewTodo = await BoardAccessService.getByTodoId(userId, newTodoId);
      if (!isAccessToNewTodo) {
        throw new BackendError.Forbidden('This account is not allowed to set this todoId for this comment');
      }
    }

    const updatedComment = await CommentService.update(commentId, {
      ...patch,
      isEdited: true,
    });

    if (updatedComment === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to edit this comment');
    }

    return true;
  }

  async remove({ userId, commentId }) {
    const isAccess = await BoardAccessService.getByCommentId(userId, commentId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this comment');
    }

    // TODO cascade
    await CommentService.removeById(commentId);
    return true;
  }
}

module.exports = {
  CommentController: new CommentController(),
};
