const { swagger } = require('../../swagger');
const {
  allowHeadersHandler,
  clientErrorHandler,
  notFoundHandler,
} = require('./common');
const { authRouter } = require('../../modules/auth/route');
const { boardRouter } = require('../../modules/board/route');
const { columnRouter } = require('../../modules/column/route');
const { todoRouter } = require('../../modules/todo/route');
const { commentRouter } = require('../../modules/comment/route');
const { commentAttachmentRouter } = require('../../modules/comment-attachment/route');

module.exports = {
  restRouter: (fastify, opts, done) => {
    fastify.addHook('onRequest', allowHeadersHandler);
    fastify.options('*', (req, res) => {
      res.status(200);
      res.send();
    });
    fastify.register(authRouter, { prefix: '/api/v1/auth' });
    fastify.register(boardRouter, { prefix: '/api/v1/board' });
    fastify.register(columnRouter, { prefix: '/api/v1/column' });
    fastify.register(todoRouter, { prefix: '/api/v1/todo' });
    fastify.register(commentRouter, { prefix: '/api/v1/comment' });
    fastify.register(commentAttachmentRouter, { prefix: '/api/v1/comment-attachment' });
    fastify.register(swagger);
    fastify.setErrorHandler(clientErrorHandler);
    fastify.setNotFoundHandler(notFoundHandler);
    done();
  },
};
