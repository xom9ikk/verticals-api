/* eslint-disable no-param-reassign */
const winston = require('winston');
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
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 1,
    colorize: false,
    format: winston.format.printf((data) => JSON.stringify(data, null, 4)),
  },
  errorLog: {
    level: 'error',
    filename: errorFile,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 1,
    colorize: false,
    format: winston.format.printf((data) => JSON.stringify(data, null, 4)),
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    colorize: true,
    format:
      winston.format.combine(
        winston.format.timestamp({
          format: 'DD/MM/YYYY - HH:mm:ss.SSS',
        }),
        winston.format.printf((info) => {
          if (!info.stack) {
            if (info.level === 'http') {
              return `[${info.timestamp}] ${Logger.generateHttpLog(info.message)}`;
            }
            if (info.level === 'database') {
              return `[${info.timestamp}] ${Logger.generateDatabaseLog(info.message)}`;
            }
            return `[${info.timestamp}] ${info.message}`;
          }
          return `[${info.timestamp}] (${info.level}) ${info.message} Stacktrace: ${info.stack}`;
        }),
      ),
  },
};

class Logger {
  constructor() {
    this.logger = winston.createLogger({
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
    this.logger.stream = {
      write(message) {
        logger.info(message);
      },
    };
    return this.logger;
  }

  static getTransports() {
    const transports = [];
    if (isProd || isTest || isDev) {
      transports.push(new winston.transports.File(options.errorLog));
      transports.push(new winston.transports.File(options.combinedLog));
    }
    if (isDev || isTest) {
      transports.push(new winston.transports.Console(options.console));
    }
    return transports;
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
