const { Operations } = require('../../../constants');

class UpdatesController {
  async updateController(data) {
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
        const responseData = {
          operation,
          data: {
            ...object,
          },
        };
        if (object.expirationDate) {
          responseData.data.expirationDate = new Date(object.expirationDate).getTime();
        }
        const response = {
          channel,
          data: responseData,
        };
        logger.info(`response: ${JSON.stringify(response)}`);
        wss.broadcast(response, (context) => userIds.includes(context.userId));
      }
    } catch (e) {
      logger.error(e);
    }
  }
}

module.exports = {
  UpdatesController: new UpdatesController(),
};
