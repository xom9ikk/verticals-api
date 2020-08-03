const { Operations } = require('../../enums');

class UpdatesHandler {
  async updateHandler(data) {
    try {
      const {
        object, operation: op, userIds, channel: c,
      } = data;
      logger.info(`userIds: ${JSON.stringify(userIds)}`);
      if (userIds) {
        const operation = Operations[op.toLowerCase()];
        const channel = c.replace('_change', '');
        delete object.createdAt;
        delete object.updatedAt;
        const response = {
          operation,
          channel,
          data: object,
        };
        logger.info(`response: ${JSON.stringify(response)}`);
        wss.broadcast(
          response,
          (context) => userIds.includes(context.userId),
        );
      }
    } catch (e) {
      logger.error(e);
    }
  }
}

module.exports = {
  UpdatesHandler: new UpdatesHandler(),
};
