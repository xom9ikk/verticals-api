const router = require('express').Router();

const { swagger } = require('../swagger');
const {
  allowHeadersHandler,
  clientErrorHandler,
  uncaughtErrorHandler,
  notFoundHandler,
} = require('./common');
const { authRouter } = require('../modules/auth/route');
const { boardRouter } = require('../modules/board/route');
const { columnRouter } = require('../modules/column/route');
const { todoRouter } = require('../modules/todo/route');
const { commentRouter } = require('../modules/comment/route');
const { commentAttachmentRouter } = require('../modules/comment-attachment/route');

// router.all('*', allowHeadersHandler);
// router.options('*', (req, res) => {
//   res.status(200);
//   res.json();
// });

// router.use(...swagger);
// router.use(clientErrorHandler);
// router.use(uncaughtErrorHandler);
// router.use(notFoundHandler);

module.exports = {
  router: (fastify, opts, done) => {
    fastify.addHook('onRequest', allowHeadersHandler);
    fastify.register(authRouter, { prefix: '/api/v1/auth' });
    fastify.register(boardRouter, { prefix: '/api/v1/board' });
    fastify.register(columnRouter, { prefix: '/api/v1/column' });
    fastify.register(todoRouter, { prefix: '/api/v1/todo' });
    fastify.register(commentRouter, { prefix: '/api/v1/comment' });
    fastify.register(commentAttachmentRouter, { prefix: '/api/v1/comment-attachment' });
    fastify.setErrorHandler(clientErrorHandler);
    done();
  },
};
