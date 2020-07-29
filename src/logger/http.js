const { v4: uuidV4 } = require('uuid');

const worker = uuidV4().substring(0, 5);
let counter = 0;

class HttpLogger {
  request(req, res, next) {
    counter += 1;
    req.requestId = `worker-${worker}_${counter}`;
    req.startTime = process.hrtime();
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
    const duration = HttpLogger.measureDuration(req.startTime);
    logger.http({
      requestId: req.requestId,
      statusCode: res.statusCode,
      raw: res.raw.payload,
      ms: duration.toFixed(3),
    });
    next();
  }

  catchResponse(req, res, payload, next) {
    Object.assign(res.raw, { payload });
    next();
  }

  static measureDuration(startTime) {
    const diff = process.hrtime(startTime);
    return diff[0] * 1e3 + diff[1] * 1e-6;
  }
}

module.exports = {
  HttpLogger,
};
