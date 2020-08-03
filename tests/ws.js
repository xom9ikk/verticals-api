const WebSocket = require('ws');
const querystring = require('querystring');

class WS {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.queries = {};
  }

  query(obj) {
    this.queries = {
      ...this.queries,
      ...obj,
    };
    return this;
  }

  start(path) {
    this.path = path;
    this.ws = new WebSocket(`${this.baseUrl}/${this.path}?${querystring.stringify(this.queries)}`);
    return this;
  }

  close() {
    this.ws.close();
  }

  onMessage(handler) {
    this.ws.on('message', (data) => {
      handler(JSON.parse(data));
    });
    return this;
  }

  onClose(handler) {
    this.ws.on('close', handler);
    return this;
  }

  onOpen(handler) {
    this.ws.on('open', handler);
    return this;
  }

  onError(handler) {
    this.ws.on('error', handler);
    return this;
  }
}

module.exports = {
  WS,
};
