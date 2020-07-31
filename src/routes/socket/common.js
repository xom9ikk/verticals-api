const { GeneralError } = require('../../components/error');

const wssErrorHandler = (connection, req, error) => {
  const isCustomError = error instanceof GeneralError;
  if (isCustomError) {
    const { status, msg } = error;
    logger.error(error);
    return connection.close(status, msg);
    return SocketResponse.Error(connection, msg);
  }
  logger.error(error);
  connection.close(1011, 'Internal socket error');
};

module.exports = {
  wssErrorHandler,
};
