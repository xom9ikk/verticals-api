/* eslint-disable no-param-reassign */
const { createLogger, format, transports } = require('winston');

const { combine } = format;

const c = require('chalk');

const { NODE_ENV, LOG_FILE_NAME } = process.env;

const isProd = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';
const isDev = NODE_ENV === 'development';

const combinedFile = `${__dirname}/../../logs/combined_${LOG_FILE_NAME}_${new Date().getTime()}.log`;
const errorFile = `${__dirname}/../../logs/error_${LOG_FILE_NAME}_${new Date().getTime()}.log`;

const options = {
  combinedLog: {
    level: 'verbose',
    filename: combinedFile,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 1,
    format: combine(
      format.timestamp(),
      format.printf((data) => JSON.stringify(data, null, 2)),
    ),
  },
  errorLog: {
    level: 'error',
    filename: errorFile,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 1,
    format: format.printf((data) => JSON.stringify(data, null, 2)),
  },
  console: {
    level: 'error',
    handleExceptions: true,
    format: format.combine(
      format.timestamp({
        format: 'DD/MM/YYYY - HH:mm:ss.SSS',
      }),
      format.printf((info) => {
        if (info.level === 'http') {
          return `[${info.timestamp}] ${Logger.generateHttpLog(info.message)}`;
        }
        if (info.level === 'database') {
          return `[${info.timestamp}] ${Logger.generateDatabaseLog(info.message)}`;
        }
        if (info.level === 'error') {
          return `[${info.timestamp}] ${c.red(`ERROR: ${info.message})`)}`;
        }
        return `[${info.timestamp}] ${info.message}`;
      }),
    ),
  },
};

class Logger {
  constructor() {
    this.logger = createLogger({
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        database: 4,
        verbose: 5,
        debug: 6,
        silly: 7,
      },
      transports: Logger.getTransports(),
    });
    this.logger.error = (err) => {
      if (err instanceof Error) {
        this.logger.log({ level: 'error', message: `${err.stack || err}` });
      } else {
        this.logger.log({ level: 'error', message: err });
      }
    };
    return this.logger;
  }

  static getTransports() {
    const availableTransports = [];
    if (isProd || isTest || isDev) {
      availableTransports.push(new transports.File(options.errorLog)); // 186 257
      availableTransports.push(new transports.File(options.combinedLog)); // 205 215 286
    }
    if (isDev
    || isTest
    ) {
      availableTransports.push(new transports.Console(options.console));
    }
    return availableTransports;
  }

  static colorize(data, chalkColors) {
    return chalkColors.map((color, i) => color(data[i]));
  }

  static generateHttpLog(data) {
    const {
      type, id, method, url, body, status, ms,
    } = data;
    const isRequest = type === 'request';
    const text = isRequest ? 'REQUEST:' : 'RESPONSE';

    const preparedData = [text, id];
    if (isRequest) {
      preparedData.push(method, url, body);
    } else {
      preparedData.push(body, status, `${ms} ms`);
    }
    const reqColors = [
      c.blue.bold, c.white, c.cyan, c.green, c.magenta,
    ];
    const resColors = [
      c.yellow.bold, c.white, c.magenta, c.green, c.yellow,
    ];
    if (isProd) {
      return preparedData.join(' ');
    }
    if (isRequest) {
      return Logger.colorize(preparedData, reqColors).join(' ');
    }
    return Logger.colorize(preparedData, resColors).join(' ');
  }

  static generateDatabaseLog(data) {
    const {
      ms, request, isError,
    } = data;
    const preparedData = ['SQL', `(${ms} ms)`, request];
    const colors = [
      c.cyan, c.cyan, isError ? c.red : c.gray,
    ];
    if (isProd) {
      return preparedData.join(' ');
    }
    return Logger.colorize(preparedData, colors).join(' ');
  }
}

module.exports = {
  Logger,
};
