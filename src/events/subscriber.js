const { PgEvent } = require('./pg-events');
const { triggers } = require('../database/triggers');
const { UpdatesHandler, CommentFileHandler } = require('./handlers');

class Subscriber {
  async subscribe() {
    this.pgEvent = await new PgEvent();
    this.pgEvent.on(triggers.commentFilesDelete, CommentFileHandler.removeCommentFileHandler);
    this.pgEvent.on(triggers.boardChange, UpdatesHandler.updateHandler);
    this.pgEvent.on(triggers.columnChange, UpdatesHandler.updateHandler);
    this.pgEvent.on(triggers.todoChange, UpdatesHandler.updateHandler);
    this.pgEvent.on(triggers.commentChange, UpdatesHandler.updateHandler);
    this.pgEvent.on(triggers.commentFilesChange, UpdatesHandler.updateHandler);
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
