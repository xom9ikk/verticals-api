const { CheckMiddleware, FetchMiddleware } = require('../../middlewares');
const { WebSocketRouter } = require('../../lib/ws');

const socketRouter = new WebSocketRouter();

socketRouter.create(
  '/updates',
  CheckMiddleware.isAuthenticatedSocket,
  FetchMiddleware.getUserId,
);

module.exports = {
  socketRouter,
};
