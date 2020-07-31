const { GeneralError } = require('./general-error');
const { BackendError } = require('./rest');
const { SocketError } = require('./socket');

module.exports = {
  GeneralError,
  BackendError,
  SocketError,
};
