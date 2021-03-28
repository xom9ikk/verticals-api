class CommentAttachmentSchema {
  uploadAttachmentToCommentParams = {
    type: 'object',
    properties: {
      commentId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['commentId'],
  }

  getCommentAttachmentsQuery = {
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

  deleteAttachmentParams = {
    type: 'object',
    properties: {
      attachmentId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['attachmentId'],
  }
}

module.exports = {
  CommentAttachmentSchema: new CommentAttachmentSchema(),
};
