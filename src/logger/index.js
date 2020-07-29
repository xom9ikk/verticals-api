const c = require('chalk');
const fs = require('fs');
const { format } = require('date-fns');
const pino = require('pino');
const pinoms = require('pino-multi-stream');

const { NODE_ENV, LOG_FILE_NAME, NODE_APP_INSTANCE } = process.env;

const isProd = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';
const isDev = NODE_ENV === 'development';

const combinedFile = `${__dirname}/../../logs/combined/${LOG_FILE_NAME}_${NODE_APP_INSTANCE}.log`;
const errorFile = `${__dirname}/../../logs/error/${LOG_FILE_NAME}_${NODE_APP_INSTANCE}.log`;

class Logger {
  constructor() {
    const streams = [];
    if (isProd || isTest || isDev) {
      streams.push({ level: 'debug', stream: fs.createWriteStream(combinedFile) }); // 186 257
      streams.push({ level: 'error', stream: fs.createWriteStream(errorFile) }); // 205 215 286
    }

    if (isDev) {
      const prettyStream = pinoms.prettyStream({
        prettyPrint: {
          levelFirst: true,
        },
        prettifier: () => (data) => {
          switch (data.level) {
            case 31: {
              return Logger.httpPrettifier(data);
            }
            case 32: {
              return Logger.databasePrettifier(data);
            }
            default: {
              return Logger.defaultPrettifier(data);
            }
          }
        },
      });
      streams.push({ level: 'debug', stream: prettyStream });
    }

    return pino({
      customLevels: {
        http: 31,
        database: 32,
      },
    },
    pinoms.multistream(streams));
  }

  static colorize(data, chalkColors) {
    return chalkColors.map((color, i) => color(data[i]));
  }

  static formatTime(date) {
    return format(date, 'dd/MM/yyyy - HH:mm:ss.SSS');
  }

  static httpPrettifier(data) {
    const {
      time, requestId, method, url, raw, body, statusCode, ms,
    } = data;
    const isRequest = !!method;
    const text = isRequest ? 'REQUEST:' : 'RESPONSE:';

    const preparedData = [`[${Logger.formatTime(time)}]`, text, requestId];
    if (isRequest) {
      preparedData.push(method, url, JSON.stringify(body));
    } else {
      preparedData.push(JSON.stringify(raw), statusCode, `${ms} ms`);
    }
    const reqColors = [
      c.green, c.blue.bold, c.white, c.cyan, c.green, c.magenta,
    ];
    const resColors = [
      c.green, c.yellow.bold, c.white, c.magenta, c.green, c.yellow,
    ];
    return Logger.colorize(preparedData, isRequest ? reqColors : resColors).join(' ');
  }

  static databasePrettifier(data) {
    const {
      time, ms, request, isError,
    } = data;
    const preparedData = [`[${Logger.formatTime(time)}]`, 'SQL', `(${ms} ms)`, request];
    const colors = [
      c.green, c.cyan.bold, c.cyan, isError ? c.red : c.gray,
    ];
    return Logger.colorize(preparedData, colors).join(' ');
  }

  static defaultPrettifier(data) {
    const {
      time, level, msg,
    } = data;
    const preparedData = [`[${Logger.formatTime(time)}]`, `(${level})`, msg];
    const colors = [
      c.yellow, c.blue, c.green,
    ];
    return Logger.colorize(preparedData, colors).join(' ');
  }
}

module.exports = {
  Logger,
};
