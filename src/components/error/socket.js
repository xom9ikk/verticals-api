// eslint-disable-next-line max-classes-per-file
const { GeneralError } = require('./general-error');

const status = {
  NormalClosure: 1000,
  UnsupportedData: 1003,
  InternalError: 1011,
  Unauthorized: 1011,
  MaxConnections: 4000,
};

const message = {
  NormalClosure: 'Normal closure',
  UnsupportedData: 'Unsupported data',
  InternalError: 'Internal socket error',
  Unauthorized: 'Unauthorized',
  MaxConnections: 'MaxConnections',
};

class NormalClosure extends GeneralError {
  constructor(_msg = message.NormalClosure) {
    super(status.NormalClosure, _msg);
  }
}

class UnsupportedData extends GeneralError {
  constructor(_msg = message.UnsupportedData) {
    super(status.UnsupportedData, _msg);
    logger.info(_msg);
  }
}

class InternalError extends GeneralError {
  constructor(_msg = message.InternalError) {
    super(status.InternalError, _msg);
  }
}

class Unauthorized extends GeneralError {
  constructor(_msg = message.Unauthorized) {
    super(status.Unauthorized, _msg);
  }
}

class MaxConnections extends GeneralError {
  constructor(_msg = message.MaxConnections) {
    super(status.MaxConnections, _msg);
  }
}

module.exports = {
  GeneralError,
  SocketError: {
    NormalClosure,
    UnsupportedData,
    InternalError,
    Unauthorized,
    MaxConnections,
  },
};
