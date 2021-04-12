const type = {
  Error: 'error',
  Data: 'content',
};

class SocketResponse {
  constructor(
    connection,
    _type,
    content,
  ) {
    SocketResponse.send(connection, _type, content);
  }

  static send(connection, _type, content) {
    return wss.send(connection, {
      type: _type,
      content,
    });
  }

  static Error(connection, content) {
    SocketResponse.send(connection, type.Error, content);
  }

  static Content(connection, content) {
    SocketResponse.send(connection, type.Data, content);
  }
}

module.exports = {
  SocketResponse,
};
