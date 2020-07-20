const { CommentService, TodoService, BoardAccessService } = require('../../services');
const { BackendError } = require('../../components');

class CommentController {
  async create(userId, comment) {
    const { todoId } = comment;
    console.log('create comment userId', userId);
    console.log('todoId', todoId);
    const boardId = await TodoService.getBoardIdByTodoId(todoId);
    console.log('boardId', boardId);

    if (boardId === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to create comment for this todo');
    }

    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create comment for this todo');
    }

    const commentId = await CommentService.create(comment);
    return commentId;
  }

  async get(userId, commentId) {
    console.log('userId', userId);
    console.log('commentId', commentId);
    const boardId = await CommentService.getBoardIdByCommentId(commentId);
    console.log('boardId', boardId);

    if (boardId === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to receive this comment');
    }

    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this comment');
    }

    const todo = await CommentService.getById(commentId);
    return todo;
  }

  async getAll(userId, boardId, columnId, todoId) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccess = await BoardAccessService.get(userId, boardId);
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
    } else if (columnId) {
      comments = await CommentService.getByColumnId(columnId);
    } else {
      comments = await CommentService.getByBoardIds(boardIdsWithAccess);
    }

    if (!comments.length) {
      throw new BackendError.Forbidden('This account does not have access to any comments');
    }

    return comments;
  }

  async update({ userId, todoId, patch }) {
    const boardId = await CommentService.getBoardIdByCommentId(todoId);

    if (boardId === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to edit this todo');
    }

    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this todo');
    }

    const updatedComment = await CommentService.update(todoId, patch);

    if (updatedComment === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to edit this todo');
    }

    return true;
  }

  async remove({ userId, todoId }) {
    const boardId = await CommentService.getBoardIdByCommentId(todoId);

    if (boardId === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to remove this todo');
    }

    const isAccess = await BoardAccessService.get(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this todo');
    }

    await CommentService.removeById(todoId);
    return true;
  }
}

module.exports = {
  CommentController: new CommentController(),
};
