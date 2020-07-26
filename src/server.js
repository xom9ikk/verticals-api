/* eslint-disable no-new */
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { Knex } = require('./knex');
const { MorganLogger } = require('./logger/morgan');
const { Logger } = require('./logger/winston');
const { Subscriber } = require('./events/subscriber');
const { router } = require('./routes');
const { parseErrorHandler } = require('./routes/common');

global.logger = new Logger();
global.knex = new Knex();

Subscriber.subscribeOnPg();

const app = express();

app.use(helmet());
app.set('trust proxy', true);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(parseErrorHandler);
new MorganLogger(app, logger);
app.use(router);

process.on('uncaughtException', (error) => {
  logger.error('uncaughtException', error);
  process.exit(1);
});

module.exports = app;
