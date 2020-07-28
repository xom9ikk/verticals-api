/* eslint-disable no-unused-vars */
const { BackendResponse } = require('../components');
const { GeneralError } = require('../components/error');

const corsOrigin = process.env.CORS_ORIGIN;

class RoutesHandler {
  async allowHeadersHandler(req, res) {
    const origin = corsOrigin || '*';
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header(
      'Access-Control-Allow-Headers',
      'access-control-allow-credentials,access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type,authorization,accept',
    );
  }

  parseErrorHandler(error, req, res, _) {
    return new BackendResponse(res, 400, 'Invalid JSON. Change the body and try again');
  }

  clientErrorHandler(error, req, res) {
    const isCustomError = error instanceof GeneralError;
    if (isCustomError) {
      const { status, msg } = error;
      return new BackendResponse(res, status, msg);
    }
    if (error.code === 'FST_ERR_CTP_INVALID_MEDIA_TYPE') {
      return new BackendResponse(res, 415, 'Invalid Media Type');
    }
    logger.error(error);
    return new BackendResponse(res, 500, 'Internal');
    // && process.exit(1);
  }

  // uncaughtErrorHandler(error, req, res, _) {
  //   logger.error(error);
  //   return new BackendResponse(res, 500, 'Internal')
  //     && process.exit(1);
  // }

  notFoundHandler(req, res) {
    return new BackendResponse(res, 404, `Route not found ${req.get('host')}${req.originalUrl}`);
  }
}

module.exports = new RoutesHandler();
