const { CommentService, BoardAccessService } = require('../../services');
const { BackendError } = require('../../components');

class CommentController {
  async create(userId, comment) {
    const { todoId } = comment;
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create comment for this todo');
    }

    const commentId = await CommentService.create(comment);
    return commentId;
  }

  async get(userId, commentId) {
    const isAccess = await BoardAccessService.getByCommentId(userId, commentId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this comment');
    }

    const comment = await CommentService.getById(commentId);
    return comment;
  }

  async getAll(userId, boardId, todoId) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccess = await BoardAccessService.getByBoardId(userId, boardId);
      if (!isAccess) {
        throw new BackendError.Forbidden('This account is not allowed to receive comments for this board');
      }
      boardIdsWithAccess = [boardId];
    } else {
      boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);
    }

    if (!boardIdsWithAccess.length) {
      throw new BackendError.Forbidden('This account does not have access to any comments');
    }

    let comments;
    if (todoId) {
      comments = await CommentService.getByTodoId(todoId);
    } else {
      comments = await CommentService.getByBoardIds(boardIdsWithAccess);
    }

    if (!comments.length) {
      throw new BackendError.Forbidden('This account does not have access to any comments');
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
