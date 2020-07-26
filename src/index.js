const { Metrics } = require('./metrics');
const app = require('./server');

const {
  PORT,
  HOST,
  METRICS_ENABLED,
  NODE_ENV,
} = process.env;

app.listen(PORT, HOST, () => {
  logger.info(`Server has been started on ${HOST}:${PORT} in ${NODE_ENV} mode`);
});

if (METRICS_ENABLED) {
  Metrics.start();
}
