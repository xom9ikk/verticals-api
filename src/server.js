/* eslint-disable no-new */
const cluster = require('cluster');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { Knex } = require('./knex');
const { MorganLogger } = require('./logger/morgan');
const { Logger } = require('./logger/winston');
const { Subscriber } = require('./events/subscriber');
const { router } = require('./routes');
const { parseErrorHandler } = require('./routes/common');

const { NODE_APP_INSTANCE } = process.env;

global.logger = new Logger();
global.knex = new Knex();

const app = express();

app.use(helmet());
app.set('trust proxy', true);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(parseErrorHandler);
new MorganLogger(app);
app.use(router);

process.on('uncaughtException', (error) => {
  logger.error(error);
  process.exit(1);
});

if (NODE_APP_INSTANCE === '0' || cluster.isMaster) {
  (async () => {
    await Subscriber.subscribeOnPg();
  })();
}

module.exports = app;
