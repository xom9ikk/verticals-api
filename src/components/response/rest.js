// eslint-disable-next-line max-classes-per-file
const { Metrics } = require('../../metrics');

const status = {
  Success: 200,
  Created: 201,
};

const message = {
  Success: 'The request has been succeeded',
  Created: 'The request has been fulfilled and resulted in a new resource being created',
};

class BackendResponse {
  constructor(
    res,
    _status = status.Success,
    msg = message.Success,
    data,
  ) {
    BackendResponse.send(res, _status, msg, data);
  }

  static send(res, _status, msg, data) {
    Metrics.counterRequests({
      status: _status,
      method: res.method,
      route: res.url,
    });
    return res
      .code(_status)
      .send({
        data: {
          ...data,
        },
        message: msg,
      });
  }

  static Success(res, msg = message.Success, data) {
    BackendResponse.send(res, status.Success, msg, data);
  }

  static Created(res, msg = message.Created, data) {
    BackendResponse.send(res, status.Created, msg, data);
  }
}

module.exports = {
  BackendResponse,
};
