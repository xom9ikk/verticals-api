/* eslint-disable no-underscore-dangle */
const WebSocket = require('ws');
const { parse: urlParse } = require('url');
const { WebSocketRouter } = require('./router');

class WebSocketServer {
  constructor(server) {
    this.socket = new WebSocket.Server({
      server,
      perMessageDeflate: false,
    });
    this.socket.on('connection', this.onConnection.bind(this));
    this.connections = new Map();
    this.userConnections = new Map();
    this.isFirst = false;
  }

  use(router) {
    this.router = router;
  }

  errorHandler(connection, req, e) {
    connection.close(1000, e.message || e);
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

  _increaseConnection(authorization) {
    let counter = this.userConnections.get(authorization) || 0;
    counter += 1;
    logger.info(authorization, counter);
    this.userConnections.set(authorization, counter);
    return counter;
  }

  _decreaseConnection(authorization) {
    let counter = this.userConnections.get(authorization);
    if (!counter) return;
    counter -= 1;
    this.userConnections.set(authorization, counter);
    return counter;
  }

  async onConnection(connection, req) {
    try {
      const context = this._getContext(req);
      const counter = this._increaseConnection(context.query.authorization);
      context.counter = counter;
      this.connections.set(connection, context);
      await this.router
        .onConnect(connection, req, context)
        .then()
        .catch((e) => {
          this.errorHandler(connection, req, e);
        });
      console.log('router onConnect');
      this.broadcast({ azazazaza: 'all' });
      this.broadcast({ azazazaza: 'bearer' }, (context) => context.query.authorization === 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInRpbWVzdGFtcCI6NzY4LCJpYXQiOjE1OTYxOTk3ODIsImV4cCI6MTYyNzc1NzM4Mn0.Y97x1QPPnwQUSEqxKCJ9IXY9lGeO0Y6MVF4nGdf-w0I');
      this.broadcast({ azazazaza: 'id' }, (context) => context.query.userId === 1);
      // this.broadcast({ azazazaza: 2 }, (context) => context.counter === 2);
      connection.on('message', (msg) => this.router
        .onMessage(connection, req, msg, context)
        .catch((e) => {
          this.errorHandler(connection, req, e.message || e);
        }));
      connection.on('close', () => this.onClose(context));
      connection.on('upgrade', this.onUpgrade);
      connection.on('pong', this.heartbeat);
    } catch (e) {
      this.errorHandler(connection, req, e);
    }
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

  onClose(context) {
    const counter = this._decreaseConnection(context.query.authorization);
    logger.info('===============onClose', counter);
  }

  onUpgrade(req, socket, head) {
    logger.info('onUpgrade');
  }

  heartbeat() {
    logger.info('heartbeat');
  }
}

module.exports = {
  WebSocketServer,
  WebSocketRouter,
};
