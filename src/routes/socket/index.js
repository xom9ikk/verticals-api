const { CheckMiddleware, FetchMiddleware } = require('../../middlewares');
const { updatesRouter } = require('../../modules/updates/route');
const { WebSocketRouter } = require('../../lib/ws');

const socketRouter = new WebSocketRouter();

socketRouter.create(
  '/updates',
  CheckMiddleware.isAuthenticatedSocket,
  FetchMiddleware.getUserId,
  ({ pathname, query, userId }, connection) => {
    logger.info(`${`${pathname}/ path middleware 1` + 'userid:'}${userId}${JSON.stringify(query)}`);
    // throw new Error('s');
  },
  updatesRouter,
);

module.exports = {
  socketRouter,
};
