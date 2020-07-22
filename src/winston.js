const winston = require('winston');

const { NODE_ENV, LOG_FILE_NAME } = process.env;

const isProd = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';
const isDev = NODE_ENV === 'development';

const filename = `${__dirname}/../logs/${LOG_FILE_NAME}_${new Date().getTime()}.log`;

const timezone = () => new Date().toLocaleString('en-US', {
  timeZone: 'UTC',
});

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
    json: false,
    colorize: true,
  },
};

const getTransports = () => {
  const transports = [];
  if (isProd
  || isTest
  ) transports.push(new winston.transports.File(options.file));
  if (isDev
  || isTest
  ) transports.push(new winston.transports.Console(options.console));
  return transports;
};

const logger = winston.createLogger({
  transports: getTransports(),
  format:
    winston.format.combine(winston.format.simple(),
      winston.format.timestamp({
        format: timezone,
      }),
      winston.format.printf((info) => `[${info.timestamp}] ${info.message}`)),
  exitOnError: false,
});

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

module.exports = logger;
