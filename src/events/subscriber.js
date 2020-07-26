const { FileComponent } = require('../components/file');
const { PgEvent } = require('./pg-events');

class Subscriber {
  async subscribeOnPg() {
    this.pgEvent = await new PgEvent();
    this.pgEvent.on('comment_files_delete', async (data) => {
      const { path } = data.payload;
      try {
        await FileComponent.removeFile(path);
      } catch (e) {
        logger.error(e);
      }
    });
  }
}

module.exports = {
  Subscriber: new Subscriber(),
};
