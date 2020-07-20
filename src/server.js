const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { Knex } = require('./knex');
const { Metrics } = require('./metrics');
const { morganLogger } = require('./morgan');

global.knex = new Knex().knex;
const routes = require('./routes');
const { parseErrorHandler } = require('./routes/common');

const {
  PORT,
  HOST,
  METRICS_ENABLED,
  NODE_ENV,
} = process.env;
const app = express();

app.use(helmet());
app.set('trust proxy', true);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(parseErrorHandler);
morganLogger(app);
app.use(routes);
app.listen(PORT, HOST, () => {
  console.log(`Server has been started on ${HOST}:${PORT} in ${NODE_ENV} mode`);
});

if (METRICS_ENABLED) {
  Metrics.start();
}

process.on('uncaughtException', (reason, p) => {
  console.error('>>>uncaughtException', reason, p);
  process.exit(1);
});
