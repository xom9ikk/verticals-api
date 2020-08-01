const { GeneralError } = require('../../components/error');

const wssErrorHandler = (connection, req, context, error) => {
  const isCustomError = error instanceof GeneralError;
  if (isCustomError) {
    const { status, msg } = error;
    // console.error('wssErrorHandler', error);
    return wss.destroy(connection, context, status, msg);
    // return SocketResponse.Error(connection, msg);
  }
  logger.error(error);
  wss.destroy(connection, context, 1011, 'Internal socket error');
};

module.exports = {
  wssErrorHandler,
};
