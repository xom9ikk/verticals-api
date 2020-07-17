const router = require('express').Router();

const { swagger } = require('../swagger');
const {
  allowHeadersHandler,
  errorHandler,
  notFoundHandler,
} = require('./common');
const { auth } = require('../modules/auth/route');
const { board } = require('../modules/board/route');

router.all('*', allowHeadersHandler);
// router.options('*', (req, res) => {
//   res.status(200);
//   res.json();
// });
router.use('/api/v1/auth', auth);
router.use('/api/v1/board', board);
router.use(...swagger);
router.use(errorHandler);
router.use(notFoundHandler);

module.exports = router;
