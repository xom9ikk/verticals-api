const { CommentService, BoardAccessService } = require('../../services');
const { BackendError, TransformerComponent } = require('../../components');

class CommentController {
  async create({ userId, comment }) {
    const { todoId, subTodoId } = comment;
    let isAccess;
    if (todoId) {
      isAccess = await BoardAccessService.getByTodoId(userId, todoId);
    } else {
      isAccess = await BoardAccessService.getBySubTodoId(userId, subTodoId);
    }

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
    userId, boardId, columnId, todoId, subTodoId,
  }) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccessToBoard = await BoardAccessService.getByBoardId(userId, boardId);
      if (!isAccessToBoard) {
        throw new BackendError.Forbidden('This account is not allowed to receive comments for this board');
      }
      boardIdsWithAccess = [boardId];
    } else {
      boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);
    }

    if (!boardIdsWithAccess.length) {
      return [];
    }

    let comments;
    if (subTodoId) {
      const isAccessToSubTodo = await BoardAccessService.getBySubTodoId(userId, subTodoId);
      if (!isAccessToSubTodo) {
        throw new BackendError.Forbidden('This account is not allowed to receive comments for this subtodo');
      }
      comments = await CommentService.getBySubTodoId(subTodoId);
    } else if (todoId) {
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

    return comments.map((comment) => ({
      ...comment,
      likedUsers: comment.likedUsers && comment.likedUsers.map((user) => ({
        ...user,
        avatar: TransformerComponent.transformLink(user.avatar),
      })),
    }));
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

    await CommentService.update(commentId, patch);

    return true;
  }

  async remove({ userId, commentId }) {
    const isAccess = await BoardAccessService.getByCommentId(userId, commentId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this comment');
    }

    await CommentService.removeById(commentId);
    return true;
  }
}

module.exports = {
  CommentController: new CommentController(),
};
