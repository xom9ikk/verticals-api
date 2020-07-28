const { FileComponent } = require('../components/file');
const { PgEvent } = require('./pg-events');

class Subscriber {
  async subscribe() {
    this.pgEvent = await new PgEvent();
    this.pgEvent.on('comment_files_delete', async (data) => {
      const { path } = data.payload;
      try {
        await FileComponent.removeFile(path);
      } catch (error) {
        logger.error(error);
      }
    });
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
