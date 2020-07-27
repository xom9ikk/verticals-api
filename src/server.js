/* eslint-disable no-new */
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { MorganLogger } = require('./logger/morgan');
const { Logger } = require('./logger/winston');
const { router } = require('./routes');
const { parseErrorHandler } = require('./routes/common');

global.logger = new Logger();

const app = express();

app.use(helmet());
app.set('trust proxy', true);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(parseErrorHandler);
new MorganLogger(app);
app.use(router);

process.on('uncaughtException', async (error) => {
  logger.error(error);
  process.exit(1);
});

module.exports = app;
