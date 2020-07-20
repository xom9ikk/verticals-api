const router = require('express').Router();

const { swagger } = require('../swagger');
const {
  allowHeadersHandler,
  errorHandler,
  notFoundHandler,
} = require('./common');
const { authRouter } = require('../modules/auth/route');
const { boardRouter } = require('../modules/board/route');
const { columnRouter } = require('../modules/column/route');
const { todoRouter } = require('../modules/todo/route');

router.all('*', allowHeadersHandler);
// router.options('*', (req, res) => {
//   res.status(200);
//   res.json();
// });
router.use('/api/v1/auth', authRouter);
router.use('/api/v1/board', boardRouter);
router.use('/api/v1/column', columnRouter);
router.use('/api/v1/todo', todoRouter);
router.use(...swagger);
router.use(errorHandler);
router.use(notFoundHandler);

module.exports = router;
