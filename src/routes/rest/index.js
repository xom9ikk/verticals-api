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

// router.all('*', allowHeadersHandler);
// router.options('*', (req, res) => {
//   res.status(200);
//   res.json();
// });

// router.use(clientErrorHandler);
// router.use(uncaughtErrorHandler);
// router.use(notFoundHandler);

module.exports = {
  restRouter: (fastify, opts, done) => {
    fastify.addHook('onRequest', allowHeadersHandler);
    fastify.register(...swagger);
    fastify.register(authRouter, { prefix: '/v1/auth' });
    fastify.register(boardRouter, { prefix: '/v1/board' });
    fastify.register(columnRouter, { prefix: '/v1/column' });
    fastify.register(todoRouter, { prefix: '/v1/todo' });
    fastify.register(commentRouter, { prefix: '/v1/comment' });
    fastify.register(commentAttachmentRouter, { prefix: '/v1/comment-attachment' });
    fastify.setErrorHandler(clientErrorHandler);
    fastify.setNotFoundHandler(notFoundHandler);
    done();
  },
};
