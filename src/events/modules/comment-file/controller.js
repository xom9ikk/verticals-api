const { FileComponent } = require('../../../components/file');

class CommentFileController {
  async removeCommentFile(data) {
    const { path } = data.object;
    try {
      await FileComponent.removeFile(path);
    } catch (error) {
      logger.error(error);
    }
  }
}

module.exports = {
  CommentFileController: new CommentFileController(),
};
