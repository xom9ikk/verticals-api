/* eslint-disable no-underscore-dangle,no-param-reassign */
const WebSocket = require('ws');
const { parse: urlParse } = require('url');
const { SocketError } = require('../../components');
const { WebSocketRouter } = require('./router');

const { MAX_SOCKET_CONNECTIONS } = process.env;

class WebSocketServer {
  constructor(server) {
    this.socket = new WebSocket.Server({
      server,
      perMessageDeflate: false,
    });
    this.socket.on('connection', this.onConnection.bind(this));
    this.connections = new Map();
    this.usersConnections = new Map();
  }

  use(router) {
    this.router = router;
  }

  errorHandler(connection, req, context, error) {
    this.destroy(connection, error);
  }

  setErrorHandler(errorHandler) {
    this.errorHandler = errorHandler;
  }

  _getContext(req) {
    const context = {};
    const { url } = req;
    const { pathname, query: rawQuery } = urlParse(url, true);
    const query = { ...rawQuery };
    context.pathname = pathname;
    context.query = query;
    return context;
  }

  _increaseConnection(context) {
    const key = this._getKeyFromContext(context);
    if (this.usersConnections.has(key)) {
      this.usersConnections.get(key).add(context);
    } else {
      this.usersConnections.set(key, new Set([context]));
    }
    return this.usersConnections.get(key).size;
  }

  _decreaseConnection(context) {
    const key = this._getKeyFromContext(context);
    if (this.usersConnections.has(key)) {
      this.usersConnections.get(key).delete(context);
    }
    return this.usersConnections.get(key).size;
  }

  _getKeyFromContext(context) {
    return context.query.authorization;
  }

  _checkLimit(connection, context) {
    const key = this._getKeyFromContext(context);
    if (this.usersConnections.get(key).size > MAX_SOCKET_CONNECTIONS) {
      throw new SocketError.MaxConnections('Account has reached the maximum number of connections');
    }
  }

  destroy(connection, context, status, message) {
    const counter = this._decreaseConnection(context);
    // console.log('router destroy', counter);
    connection.close(status || 1000, message);
  }

  broadcast(data, filter) {
    this.connections.forEach((context, connection) => {
      if (!filter || filter(context)) {
        this.send(connection, data);
      }
    });
  }

  send(connection, data) {
    connection.send(JSON.stringify(data));
  }

  async onConnection(connection, req) {
    let context = {};
    try {
      context = this._getContext(req);
      const counter = this._increaseConnection(context);
      this._checkLimit(connection, context);
      context.counter = counter;
      this.connections.set(connection, context);
      await this.router
        .onConnect(connection, req, context)
        .then()
        .catch((e) => {
          this.errorHandler(connection, req, context, e);
        });
      connection.on('message', (msg) => this.router
        .onMessage(connection, req, msg, context)
        .catch((e) => {
          this.errorHandler(connection, req, context, e);
        }));
      connection.on('close', () => this.onClose(context));
    } catch (e) {
      this.errorHandler(connection, req, context, e);
    }
  }

  onClose(context) {
    const counter = this._decreaseConnection(context);
    logger.info(`===============onClose ${counter} ${JSON.stringify(context)}`);
  }
}

module.exports = {
  WebSocketServer,
  WebSocketRouter,
};
