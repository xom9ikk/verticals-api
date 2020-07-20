class CommentSchema {
  createComment = {
    type: 'object',
    properties: {
      todoId: {
        type: 'integer',
        minimum: 1,
      },
      text: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
      },
      isEdited: {
        type: 'boolean',
      },
      replyCommentId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['todoId'],
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
    },
  }
  patchCommentBody = {
    type: 'object',
    properties: {
      columnId: {
        type: 'integer',
        minimum: 1,
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      position: {
        type: 'integer',
        minimum: 0,
      },
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
      },
      status: {
        type: 'number',
        enum: [0, 1, 2],
      },
      color: {
        type: 'number',
        enum: [0, 1, 2, 3, 4, 5, 6],
      },
      isArchived: {
        type: 'boolean',
      },
      isNotificationsEnabled: {
        type: 'boolean',
      },
    },
    anyOf: [
      { required: ["columnId"] },
      { required: ["title"] },
      { required: ["position"] },
      { required: ["description"] },
      { required: ["status"] },
      { required: ["color"] },
      { required: ["isArchived"] },
      { required: ["isNotificationsEnabled"] },
    ],
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
