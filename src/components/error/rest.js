// eslint-disable-next-line max-classes-per-file
const { GeneralError } = require('./general-error');

const status = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  UnprocessableEntity: 422,
  Conflict: 409,
  InternalError: 500,
};

const message = {
  BadRequest: 'Bad Request',
  Unauthorized: 'Unauthorized',
  Forbidden: 'Forbidden',
  NotFound: 'Not found',
  UnprocessableEntity: 'Unprocessable entity',
  Conflict: 'Conflict',
  InternalError: 'Internal server error',
};

class BadRequest extends GeneralError {
  constructor(_msg = message.BadRequest) {
    super(status.BadRequest, _msg);
  }
}

class Unauthorized extends GeneralError {
  constructor(_msg = message.Unauthorized) {
    super(status.Unauthorized, _msg);
  }
}

class Forbidden extends GeneralError {
  constructor(_msg = message.Forbidden) {
    super(status.Forbidden, _msg);
  }
}

class NotFound extends GeneralError {
  constructor(_msg = message.NotFound) {
    super(status.NotFound, _msg);
  }
}

class UnprocessableEntity extends GeneralError {
  constructor(_msg = message.UnprocessableEntity) {
    super(status.UnprocessableEntity, _msg);
  }
}

class Conflict extends GeneralError {
  constructor(_msg = message.Conflict) {
    super(status.Conflict, _msg);
  }
}

class InternalError extends GeneralError {
  constructor(_msg = message.InternalError) {
    super(status.InternalError, _msg);
  }
}

module.exports = {
  GeneralError,
  BackendError: {
    BadRequest,
    Unauthorized,
    Forbidden,
    NotFound,
    UnprocessableEntity,
    Conflict,
    InternalError,
  },
};
