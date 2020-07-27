/* eslint-disable no-param-reassign */
const morgan = require('morgan');
const { v4: uuidV4 } = require('uuid');

class MorganLogger {
  constructor(app) {
    const originalSend = app.response.send;
    app.response.send = function sendOverWrite(body) {
      originalSend.call(this, body);
      this.resBody = body;
    };
    morgan.token('reqBody', (req) => JSON.stringify(req.body));
    morgan.token('resBody', (req, res) => res.resBody);
    morgan.token('requestId', (req) => req.requestId);
    app.use(morgan(MorganLogger.logRequest, {
      immediate: true,
    }));
    app.use(morgan(MorganLogger.logResponse));
  }

  static colorize(data, chalkColors) {
    return chalkColors.map((color, i) => color(data[i]));
  }

  static logRequest(tokens, req, res) {
    const id = uuidV4();
    res.locals.morganId = id;
    logger.http({
      type: 'request',
      id,
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      body: tokens.reqBody(req, res),
    });
  }

  static logResponse(tokens, req, res) {
    logger.http({
      type: 'response',
      id: res.locals.morganId,
      url: tokens.url(req, res),
      body: tokens.resBody(req, res),
      status: tokens.status(req, res),
      ms: tokens['total-time'](req, res),
    });
  }
}

module.exports = {
  MorganLogger,
};
