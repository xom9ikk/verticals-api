class CommentLikeSchema {
  createCommentLike = {
    type: 'object',
    properties: {
      commentId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['commentId'],
  }

  deleteCommentLikeParams = {
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
  CommentLikeSchema: new CommentLikeSchema(),
};
