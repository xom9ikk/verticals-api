const cluster = require('cluster');
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

build(knex).listen(PORT, HOST, async (error) => {
  if (error) {
    logger.error(error);
    process.exit(1);
  }
  if (NODE_APP_INSTANCE === '0' || cluster.isMaster) {
    await Subscriber.subscribe();
  }
  logger.info(`Server has been started on ${HOST}:${PORT} in ${NODE_ENV} mode`);
});

if (METRICS_ENABLED) {
  Metrics.start();
}
