const cluster = require('cluster');
const app = require('./server');
const { Metrics } = require('./metrics');
const { Knex } = require('./knex');
const { Subscriber } = require('./events/subscriber');

const { NODE_APP_INSTANCE } = process.env;

global.knex = new Knex();

const {
  PORT,
  HOST,
  METRICS_ENABLED,
  NODE_ENV,
} = process.env;

app.listen(PORT, HOST, () => {
  logger.info(`Server has been started on ${HOST}:${PORT} in ${NODE_ENV} mode`);
});

if (NODE_APP_INSTANCE === '0' || cluster.isMaster) {
  (async () => {
    await Subscriber.subscribeOnPg();
  })();
}

if (METRICS_ENABLED) {
  Metrics.start();
}
