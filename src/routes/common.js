const { BackendResponse } = require('../components');
const { GeneralError } = require('../components/error');

const corsOrigin = process.env.CORS_ORIGIN;

class RoutesHandler {
  allowHeadersHandler(req, res, next) {
    const origin = req.get('origin') || corsOrigin;
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
    res.header(
      'Access-Control-Allow-Headers',
      'access-control-allow-credentials,access-control-allow-headers,access-control-allow-methods,access-control-allow-origin,content-type,authorization,accept',
    );
    next();
  }

  // eslint-disable-next-line no-unused-vars
  errorHandler(error, req, res, _) {
    const isCustomError = error instanceof GeneralError;
    const { status = 500, msg } = error;
    if (!isCustomError) {
      console.error('errorHandler', error);
      return new BackendResponse(res, status, 'Internal') && process.exit(1);
    }
    return new BackendResponse(res, status, msg);
  }

  notFoundHandler(req, res) {
    return new BackendResponse(res, 404, `Route not found ${req.get('host')}${req.originalUrl}`);
  }
}

module.exports = new RoutesHandler();
