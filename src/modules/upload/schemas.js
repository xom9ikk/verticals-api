class UploadSchema {
  uploadFileToCommentParams = {
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
  UploadSchema: new UploadSchema(),
};
