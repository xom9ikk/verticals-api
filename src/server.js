const Fastify = require('fastify');
const middie = require('middie');
const fastifyMultipart = require('fastify-multipart');
const helmet = require('fastify-helmet');
const { Logger } = require('./logger');
const { HttpLogger } = require('./logger/http');
const { BackendError } = require('./components');
const { router } = require('./routes');

global.logger = new Logger();
// global.logger = new Logger();
// global.logger = pino({
//   customLevels: {
//     database: 30,
//   },
//   prettyPrint: {
//     translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
//     customPrettifiers: {
//       method: (value) => c.blue.bold(value),
//       body: (value) => c.blue(JSON.stringify(value, null, 2)),
//       url: (value) => c.yellow(value),
//       requestId: (value) => c.white(value),
//       headers: (value) => c.white(JSON.stringify(value, null, 2)),
//       request: (value) => c.cyan(JSON.stringify(value, null, 2)),
//       statusCode: (value) => (value >= 400 ? c.red(value) : c.green(value)),
//     },
//   },
// });

process.on('uncaughtException', (error) => {
  logger.error(error);
  process.exit(1);
});

const build = (knex) => {
  global.knex = knex;
  const app = Fastify();
  const httpLogger = new HttpLogger();
  app.addHook('preHandler', httpLogger.request);
  app.addHook('onResponse', httpLogger.response);
  app.addHook('preSerialization', httpLogger.catchResponse);
  // app.addHook('onSend', httpLogger.catchResponse);
  app.register(async (fastify) => {
    await fastify.register(middie);
    fastify.addContentTypeParser(
      'application/json',
      { parseAs: 'string' },
      async (req, body) => {
        try {
          return body ? JSON.parse(body) : {};
        } catch (err) {
          throw new BackendError.BadRequest('Invalid JSON. Change the body and try again');
        }
      },
    );
    fastify.register(fastifyMultipart, {
      defCharset: 'utf8',
      limits: {
        fields: 1,
        fileSize: 1048576, // 1 MB
        file: 1,
        parts: 1,
      },
    });
    fastify.register(helmet);
    fastify.decorateRequest('file', '');
    fastify.decorateRequest('user', '');
    fastify.decorateRequest('userId', '');
    fastify.decorateRequest('parsedBearerToken', '');
    fastify.register(router);
  });
  return app;
};

module.exports = {
  build,
};
