/* eslint-disable no-underscore-dangle,no-restricted-syntax */
const { SocketError } = require('../../components/error');

class WebSocketRouter {
  constructor() {
    this.pathes = new Map();
    this.methods = new Map();
  }

  async onMessage(connection, req, msg, context) {
    const pathCallbacks = this.pathes.get(context.pathname);
    const methodRouter = pathCallbacks.find((c) => c instanceof WebSocketRouter);
    const data = JSON.parse(msg);
    const { method, content } = data;
    const messageContext = {
      method,
      content,
    };
    const methodCallbacks = methodRouter.methods.get(method);
    await this._callMethodMiddleware(
      method, methodCallbacks, context, messageContext, connection,
    );
  }

  async onConnect(connection, req, context) {
    const pathCallbacks = this.pathes.get(context.pathname);
    if (this.pathes.size !== 0) {
      await this._callPathMiddleware(
        context.pathname, pathCallbacks, context, connection,
      );
    }
  }

  async _callPathMiddleware(
    pathname, pathCallbacks, context, connection,
  ) {
    if (!pathCallbacks) {
      throw new SocketError.UnsupportedData(`Path ${pathname} is not allow`);
    }
    for await (const pathCallback of pathCallbacks) {
      const isRouter = pathCallback instanceof WebSocketRouter;
      if (!isRouter) {
        await pathCallback(context, connection);
      }
    }
  }

  async _callMethodMiddleware(method, methodCallbacks, context, messageContext, connection) {
    if (!methodCallbacks) {
      throw new SocketError.UnsupportedData(`Method ${method} is not allow`);
    }
    for await (const methodCallback of methodCallbacks) {
      await methodCallback(context, messageContext, connection);
    }
  }

  create(path, ...rest) {
    this.pathes.set(path, rest);
  }

  createMethod(method, ...callbacks) {
    this.methods.set(method, callbacks);
  }
}

module.exports = {
  WebSocketRouter,
};
