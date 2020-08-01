const { FileComponent } = require('../../components/file');

class CommentFileHandler {
  async removeCommentFileHandler(data) {
    const { path } = data.object;
    try {
      await FileComponent.removeFile(path);
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = {
  CommentFileHandler: new CommentFileHandler(),
};
