/* eslint-disable no-param-reassign */
const morgan = require('morgan');
const c = require('chalk');
const { v4: uuidV4 } = require('uuid');
const winston = require('./winston');

const { NODE_ENV } = process.env;
const isProd = NODE_ENV === 'production';
// const isTest = NODE_ENV === 'test';
let formattedLog;
if (isProd) {
  formattedLog = (tokens, req, res) => {
    const isError = parseInt(tokens.status(req, res)) >= 400;
    const id = uuidV4();
    return [
      'Req:',
      id,
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.reqBody(req, res),
      '\nRes:',
      id,
      tokens.resBody(req, res),
      isError
        ? `Err: ${tokens.status(req, res)}`
        : tokens.status(req, res),
      `${tokens['total-time'](req, res)} ms`,
    ].join(' ');
  };
} else {
  formattedLog = (tokens, req, res) => {
    const isError = parseInt(tokens.status(req, res)) >= 400;
    const id = uuidV4();
    return [
      c.blue.bold('Req:'),
      c.white(id),
      c.cyan(tokens.method(req, res)),
      c.green(tokens.url(req, res)),
      c.magenta(tokens.reqBody(req, res)),
      c.yellow.bold('\nRes:'),
      c.white(id),
      ' '.repeat(tokens.method(req, res).length),
      ' '.repeat(tokens.url(req, res).length),
      c.magenta(tokens.resBody(req, res)),
      isError
        ? `Err: ${c.red(tokens.status(req, res))}`
        : c.green(tokens.status(req, res)),
      c.yellow(`${tokens['total-time'](req, res)} ms`),
    ].join(' ');
  };
}

const morganMiddleware = morgan(formattedLog, {
  stream: isProd ? winston.stream : null,
});

const morganLogger = (app) => {
  const originalSend = app.response.send;
  app.response.send = function sendOverWrite(body) {
    originalSend.call(this, body);
    this.body = body;
  };
  morgan.token('reqBody', (req) => JSON.stringify(req.body));
  morgan.token('resBody', (req, res) => res.body);
  morgan.token('requestId', (req) => req.requestId);
  app.use(morganMiddleware);
};

module.exports = {
  morganLogger,
};
