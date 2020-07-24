/* eslint-disable no-param-reassign */
const morgan = require('morgan');
const c = require('chalk');
const { v4: uuidV4 } = require('uuid');
const winston = require('./winston');

const { NODE_ENV } = process.env;
const isProd = NODE_ENV === 'production';

const colorize = (data, chalkColors) => chalkColors.map((color, i) => color(data[i]));

const formattedLogRequest = (tokens, req, res) => {
  const id = uuidV4();
  res.locals.morganId = id;
  const chalkColors = [
    c.blue.bold,
    c.white,
    c.cyan,
    c.green,
    c.magenta,
  ];
  const data = [
    'Req:',
    id,
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.reqBody(req, res),
  ];
  if (!isProd) {
    return colorize(data, chalkColors).join(' ');
  }
  return data.join(' ');
};

const formattedLogResponse = (tokens, req, res) => {
  const isError = parseInt(tokens.status(req, res)) >= 400;
  const data = [
    'Res:',
    res.locals.morganId,
    tokens.resBody(req, res),
    isError
      ? `Err: ${tokens.status(req, res)}`
      : tokens.status(req, res),
    `${tokens['total-time'](req, res)} ms`,
  ];
  const chalkColors = [
    c.yellow.bold,
    c.white,
    c.magenta,
    isError ? c.red : c.green,
    c.yellow,
  ];
  if (!isProd) {
    return colorize(data, chalkColors).join(' ');
  }
  return data.join(' ');
};

const morganRequest = morgan(formattedLogRequest, {
  immediate: true,
  stream: winston.stream,
});

const morganResponse = morgan(formattedLogResponse, {
  stream: winston.stream,
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
  app.use(morganRequest);
  app.use(morganResponse);
};

module.exports = {
  morganLogger,
};
