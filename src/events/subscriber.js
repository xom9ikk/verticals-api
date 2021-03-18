const { PgEvent } = require('./pg-events');
const { triggers } = require('../database/triggers');
const { UpdatesController } = require('./modules/updates/controller');
const { CommentFileController } = require('./modules/comment-file/controller');

class Subscriber {
  async subscribe() {
    this.pgEvent = await new PgEvent();
    this.pgEvent.on(triggers.commentFilesDelete, CommentFileController.removeCommentFile);
    this.pgEvent.on(triggers.boardChange, UpdatesController.updateController);
    this.pgEvent.on(triggers.columnChange, UpdatesController.updateController);
    this.pgEvent.on(triggers.headingChange, UpdatesController.updateController);
    this.pgEvent.on(triggers.todoChange, UpdatesController.updateController);
    this.pgEvent.on(triggers.commentChange, UpdatesController.updateController);
    this.pgEvent.on(triggers.commentFilesChange, UpdatesController.updateController);
    this.pgEvent.on(triggers.boardPositionChange, UpdatesController.updateController);
    this.pgEvent.on(triggers.columnPositionChange, UpdatesController.updateController);
    this.pgEvent.on(triggers.headingPositionChange, UpdatesController.updateController);
    this.pgEvent.on(triggers.todoPositionChange, UpdatesController.updateController);
  }

  async unsubscribe() {
    try {
      if (!this.pgEvent) return;
      this.pgEvent.clear();
      await this.pgEvent.releaseConnection();
    } catch (e) {
      logger.error(e);
    }
  }
}

module.exports = {
  Subscriber: new Subscriber(),
};
