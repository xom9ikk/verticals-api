const { SocketResponse } = require('../../components/response');
const { SchemaValidator } = require('../../middlewares');
const { WebSocketRouter } = require('../../lib/ws/router');

const updatesRouter = new WebSocketRouter();

updatesRouter.createMethod(
  'board',
  SchemaValidator.validateSocketContent('wsUpdateBoard'),
  ({ pathname, query }, { method, content }, connection) => {
    logger.info(`${pathname}/${method} method middleware 1`, content);
  },
  ({ pathname, query, counter }, { method, content }, connection) => {
    logger.info(`${pathname}/${method} controller`);
    return SocketResponse.Content(connection, { method, content, counter });
  },
);

module.exports = {
  updatesRouter,
};
