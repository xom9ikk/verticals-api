const winston = require('winston');

const { LOG_FILE_NAME } = process.env;

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

const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    // new winston.transports.Console(options.console),
  ],
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
