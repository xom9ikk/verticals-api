const cluster = require('cluster');
const { app } = require('./server');
const { Metrics } = require('./metrics');
const { build } = require('./server');
const { Knex } = require('./knex');
const { Subscriber } = require('./events/subscriber');

const { NODE_APP_INSTANCE } = process.env;

const {
  PORT,
  HOST,
  METRICS_ENABLED,
  NODE_ENV,
} = process.env;

const knex = new Knex();

build(knex).listen(PORT, HOST, async () => {
  await Subscriber.subscribe();
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
