/* eslint-disable no-new */
const Fastify = require('fastify');
const middie = require('middie');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const fastifyMultipart = require('fastify-multipart');
const { BackendError } = require('./components');
const { MorganLogger } = require('./logger/morgan');
const { Logger } = require('./logger/winston');
const { router } = require('./routes');
const { parseErrorHandler } = require('./routes/common');

global.logger = new Logger();

// Subscriber.subscribeOnPg();

process.on('uncaughtException', (error) => {
  console.error('uncaughtException', error);
  // process.exit(1);
});
const build = (knex) => {
  global.knex = knex;
  const app = Fastify();
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
    // app.use(helmet());
    // app.set('trust proxy', true);
    // app.use(bodyParser.json({ limit: '50mb' }));
    // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    // fastify.use(parseErrorHandler);
    // new MorganLogger(app, logger);
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
