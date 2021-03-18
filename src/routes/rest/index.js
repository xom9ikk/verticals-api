const { swagger } = require('../../swagger');
const {
  allowHeadersHandler,
  errorHandler,
  notFoundHandler,
} = require('./common');
const { authRouter } = require('../../modules/auth/route');
const { userRouter } = require('../../modules/user/route');
const { boardRouter } = require('../../modules/board/route');
const { columnRouter } = require('../../modules/column/route');
const { headingRouter } = require('../../modules/heading/route');
const { todoRouter } = require('../../modules/todo/route');
const { commentRouter } = require('../../modules/comment/route');
const { commentAttachmentRouter } = require('../../modules/comment-attachment/route');
const { commentLikeRouter } = require('../../modules/comment-like/route');
const { searchRouter } = require('../../modules/search/route');

module.exports = {
  restRouter: (fastify, opts, done) => {
    fastify.addHook('onRequest', allowHeadersHandler);
    fastify.options('*', (req, res) => {
      res.status(200);
      res.send();
    });
    fastify.register(userRouter, { prefix: '/api/v1/user' });
    fastify.register(authRouter, { prefix: '/api/v1/auth' });
    fastify.register(boardRouter, { prefix: '/api/v1/board' });
    fastify.register(columnRouter, { prefix: '/api/v1/column' });
    fastify.register(headingRouter, { prefix: '/api/v1/heading' });
    fastify.register(todoRouter, { prefix: '/api/v1/todo' });
    fastify.register(commentRouter, { prefix: '/api/v1/comment' });
    fastify.register(commentAttachmentRouter, { prefix: '/api/v1/comment-attachment' });
    fastify.register(commentLikeRouter, { prefix: '/api/v1/comment-like' });
    fastify.register(searchRouter, { prefix: '/api/v1/search' });
    fastify.register(swagger);
    fastify.setErrorHandler(errorHandler);
    fastify.setNotFoundHandler(notFoundHandler);
    done();
  },
};
