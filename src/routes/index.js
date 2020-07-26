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

router.all('*', allowHeadersHandler);
// router.options('*', (req, res) => {
//   res.status(200);
//   res.json();
// });
router.use('/api/v1/auth', authRouter);
router.use('/api/v1/board', boardRouter);
router.use('/api/v1/column', columnRouter);
router.use('/api/v1/todo', todoRouter);
router.use('/api/v1/comment', commentRouter);
router.use('/api/v1/comment-attachment', commentAttachmentRouter);
router.use(...swagger);
router.use(clientErrorHandler);
router.use(uncaughtErrorHandler);
router.use(notFoundHandler);

module.exports = {
  router,
};
