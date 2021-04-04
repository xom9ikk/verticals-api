/* eslint-disable no-unused-vars */
const { BackendResponse } = require('../../components');
const { GeneralError } = require('../../components/error');
const { version } = require('../../../package.json');

const corsOrigin = process.env.CORS_ORICORS_ORIGINGIN;

class RoutesHandler {
  // async allowHeadersHandler(req, res) {
  //   const origin = corsOrigin || '*';
  //   res.header('Access-Control-Allow-Origin', origin);
  //   res.header('Access-Control-Allow-Credentials', 'true');
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     'access-control-allow-credentials,'
  //     + 'access-control-allow-headers,'
  //     + 'access-control-allow-methods,'
  //     + 'access-control-allow-origin,'
  //     + 'content-type,'
  //     + 'authorization,'
  //     + 'accept',
  //   );
  // }

  version(fastify, opts, done) {
    fastify.get(
      '/version',
      (req, res) => new BackendResponse(res, 200, 'Version received successfully',
        { version: `Version: ${version}-${process.env.COMMIT_HASH}` }),
    );
    done();
  }

  errorHandler(error, req, res) {
    const isCustomError = error instanceof GeneralError;
    if (isCustomError) {
      const { status, msg } = error;
      return new BackendResponse(res, status, msg);
    }
    if (error.code === 'FST_ERR_CTP_INVALID_MEDIA_TYPE') {
      return new BackendResponse(res, 415, 'Invalid Media Type');
    }
    console.log(error);
    logger.error(error);
    return new BackendResponse(res, 500, 'Internal');// && process.exit(1);
  }

  notFoundHandler(req, res) {
    return new BackendResponse(res, 404, `Route ${req.url} not found`);
  }
}

module.exports = new RoutesHandler();
