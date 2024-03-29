class CommentSchema {
  createComment = {
    type: 'object',
    properties: {
      todoId: {
        type: 'integer',
        minimum: 1,
      },
      subTodoId: {
        type: 'integer',
        minimum: 1,
      },
      text: {
        type: 'string',
        minLength: 0,
        maxLength: 16384,
      },
      replyCommentId: {
        type: 'integer',
        minimum: 1,
      },
    },
    anyOf: [
      { required: ['todoId'] },
      { required: ['subTodoId'] },
    ],
  }

  getComment = {
    type: 'object',
    properties: {
      commentId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['commentId'],
  }

  getCommentsQuery = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
      },
      columnId: {
        type: 'integer',
      },
      todoId: {
        type: 'integer',
      },
      subTodoId: {
        type: 'integer',
      },
    },
  }

  patchCommentBody = {
    type: 'object',
    properties: {
      text: {
        type: 'string',
        minLength: 0,
        maxLength: 16384,
      },
    },
    required: ['text'],
  }

  patchCommentParams = {
    type: 'object',
    properties: {
      commentId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['commentId'],
  }

  deleteCommentParams = {
    type: 'object',
    properties: {
      commentId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['commentId'],
  }
}

module.exports = {
  CommentSchema: new CommentSchema(),
};
