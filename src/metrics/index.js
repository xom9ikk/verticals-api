/* eslint-disable no-underscore-dangle,no-console */
const fastify = require('fastify');
const cluster = require('cluster');
const promClient = require('prom-client');
const pm2Cluster = require('./prometheus-pm2');

const {
  METRICS_PORT,
  METRICS_HOST,
  METRICS_ROUTE,
  METRICS_TIMEOUT,
  NODE_APP_INSTANCE,
} = process.env;

const _counterRequests = new promClient.Counter({
  name: 'counter_requests',
  help: 'counter_requests_help',
  labelNames: ['worker', 'status', 'method', 'route'],
});

const worker = cluster.worker ? `worker_${NODE_APP_INSTANCE}` : 'master';

class Metrics {
  static counterRequests({ status, method, route }) {
    _counterRequests.inc({
      worker,
      status,
      method,
      route,
    });
  }

  static start() {
    const app = fastify();
    promClient.collectDefaultMetrics({ timeout: METRICS_TIMEOUT });
    app.get(METRICS_ROUTE, pm2Cluster);
    app.listen(METRICS_PORT, METRICS_HOST, () => {
      logger.info(`Metrics server has been started on ${METRICS_HOST}:${METRICS_PORT}${METRICS_ROUTE}`
        + ` on worker ${NODE_APP_INSTANCE}`);
    });
  }
}

module.exports = {
  Metrics,
};
