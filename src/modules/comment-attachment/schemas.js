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
