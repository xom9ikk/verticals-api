/* eslint-disable no-param-reassign */
const winston = require('winston');

const { NODE_ENV, LOG_FILE_NAME } = process.env;

const isProd = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';
const isDev = NODE_ENV === 'development';

// const filename = `${__dirname}/../logs/${LOG_FILE_NAME}_${new Date().getTime()}.log`;
const filename = `${__dirname}/../logs/${LOG_FILE_NAME}_.log`;

const options = {
  file: {
    level: 'info',
    filename,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 1,
  },
  console: {
    level: 'debug',
    handleExceptions: true,
    json: true,
    colorize: true,
  },
};

const getTransports = () => {
  const transports = [];
  if (isProd
  || isTest
  || isDev
  ) transports.push(new winston.transports.File(options.file));
  if (isDev
  || isTest
  ) transports.push(new winston.transports.Console(options.console));
  return transports;
};

const enumerateErrorFormat = winston.format((info) => {
  if (info.message instanceof Error) {
    info.message = {
      message: info.message.message,
      stack: info.message.stack,
      ...info.message,
    };
  }

  if (info instanceof Error) {
    return {
      message: info.message,
      stack: info.stack,
      ...info,
    };
  }

  return info;
});

const logger = winston.createLogger({
  transports: getTransports(),
  format:
    winston.format.combine(
      winston.format.simple(),
      winston.format.timestamp({
        format: 'DD/MM/YYYY - HH:mm:ss.SSS',
      }),
      winston.format.printf((info) => {
        if (!info.stack) {
          return `[${info.timestamp}] ${info.message}`;
        }
        return `[${info.timestamp}] (${info.level}) ${info.message} ------ ${info.stack}`;
      }),
    ),
});

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

global.logger = logger;

module.exports = logger;
