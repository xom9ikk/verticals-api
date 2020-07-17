const router = require('express').Router();

const { swagger } = require('../swagger');
const {
  allowHeadersHandler,
  errorHandler,
  notFoundHandler,
} = require('./common');
const authRoute = require('../modules/auth/route');

router.all('*', allowHeadersHandler);
// router.options('*', (req, res) => {
//   res.status(200);
//   res.json();
// });
router.use('/api/v1/auth', authRoute);
router.use(...swagger);
router.use(errorHandler);
router.use(notFoundHandler);

module.exports = router;
