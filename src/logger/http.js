const now = require('performance-now');
const { v4: uuidV4 } = require('uuid');

const worker = uuidV4().substring(0, 5);
let counter = 0;

class HttpLogger {
  request(req, res, next) {
    counter += 1;
    req.requestId = `worker-${worker}_${counter}`;
    req.startTime = now();
    logger.http({
      method: req.method,
      url: req.url,
      path: req.path,
      parameters: req.parameters,
      body: req.body,
      headers: req.headers,
      requestId: req.requestId,
    });
    next();
  }

  response(req, res, next) {
    const duration = now() - req.startTime;
    logger.http({
      requestId: req.requestId,
      statusCode: res.statusCode,
      raw: res.raw.payload,
      ms: duration.toFixed(3),
    });
    next();
  }

  catchResponse(req, res, payload, next) {
    res.raw.payload = payload;
    next();
  }
}

module.exports = {
  HttpLogger,
};
