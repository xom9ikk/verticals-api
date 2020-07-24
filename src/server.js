const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { Knex } = require('./knex');
const { morganLogger } = require('./morgan');

global.knex = new Knex().knex;
const routes = require('./routes');
const { parseErrorHandler } = require('./routes/common');

const app = express();

app.use(helmet());
app.set('trust proxy', true);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(parseErrorHandler);
morganLogger(app);
app.use(routes);

process.on('uncaughtException', (error) => {
  logger.error('uncaughtException', error);
  process.exit(1);
});

module.exports = app;
