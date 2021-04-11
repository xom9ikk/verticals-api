const http = require('http');
const Fastify = require('fastify');
const middie = require('middie');
const fastifyMultipart = require('fastify-multipart');
const helmet = require('fastify-helmet');
const cors = require('fastify-cors');
const sjson = require('secure-json-parse');
const { WebSocketServer } = require('./lib/ws');
const { Logger } = require('./logger');
const { HttpLogger } = require('./logger/http');
const { BackendError } = require('./components/error');
const { restRouter, socketRouter } = require('./routes');
const { wssErrorHandler } = require('./routes/socket/common');

global.logger = new Logger();

process.on('uncaughtException', (error) => {
  logger.error(error);
  process.exit(1);
});

const { CORS_ORIGIN } = process.env;

let server;
const serverFactory = (handler) => {
  server = http.createServer((req, res) => {
    handler(req, res);
  });
  return server;
};

const build = (knex) => {
  global.knex = knex;
  const app = Fastify({ serverFactory });
  const httpLogger = new HttpLogger();
  app.addHook('preHandler', httpLogger.request);
  app.addHook('onResponse', httpLogger.response);
  app.addHook('preSerialization', httpLogger.catchResponse);
  app.register(async (fastify) => {
    await fastify.register(middie);
    fastify.addContentTypeParser(
      'application/json',
      { parseAs: 'string' },
      async (req, body) => {
        try {
          return body ? sjson.parse(body, {
            protoAction: 'remove',
            constructorAction: 'remove',
          }) : {};
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
    fastify.register(cors, {
      origin: CORS_ORIGIN || '*',
      credentials: true,
      methods: [
        'GET',
        'PUT',
        'POST',
        'DELETE',
        'PATCH',
      ],
      allowedHeaders: [
        'access-control-allow-credentials',
        'access-control-allow-headers',
        'access-control-allow-methods',
        'access-control-allow-origin',
        'content-type',
        'authorization',
        'accept',
        'accept-language',
      ],
    });
    fastify.decorateRequest('file', '');
    fastify.decorateRequest('user', '');
    fastify.decorateRequest('userId', '');
    fastify.decorateRequest('parsedBearerToken', '');
    fastify.register(restRouter);
  });

  global.wss = new WebSocketServer(server);
  wss.use(socketRouter);
  wss.setErrorHandler(wssErrorHandler);
  return app;
};

module.exports = {
  build,
};
