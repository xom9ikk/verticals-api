/* eslint-disable no-underscore-dangle,no-async-promise-executor,no-restricted-syntax */
class PgEvent {
  constructor() {
    return new Promise(async (resolve) => {
      if (typeof PgEvent.instance === 'object') {
        return resolve(PgEvent.instance);
      }
      this._events = new Map();
      this._wrappers = new Map();
      await this._setupConnection();
      PgEvent.instance = this;
      return resolve(this);
    });
  }

  on(channel, fn) {
    this._connection.query(`LISTEN ${channel}`);
    const event = this._events.get(channel);
    if (event) event.add(fn);
    else this._events.set(channel, new Set([fn]));
  }

  once(channel, callback) {
    const wrapper = async (...args) => {
      await this.remove(channel, wrapper);
      callback(...args);
    };
    this._wrappers.set(callback, wrapper);
    this.on(channel, wrapper);
  }

  async remove(channel, callback) {
    const event = this._events.get(channel);
    if (!event) return;
    if (event.has(callback)) {
      event.delete(callback);
      if (event.size === 0) {
        this._events.delete(channel);
        this._unlisten(channel);
      }
      return;
    }

    const wrapper = this._wrappers.get(callback);
    if (wrapper) {
      event.delete(wrapper);
      if (event.size === 0) {
        this._events.delete(channel);
        this._unlisten(channel);
      }
    }

    if (!callback) {
      this._events.delete(channel);
      this._unlisten(channel);
    }
  }

  _unlisten(channel) {
    this._connection.query(`UNLISTEN ${channel}`);
  }

  clear(channel) {
    if (channel) {
      this._events.delete(channel);
      this.channels().forEach((c) => this.remove(c));
    } else {
      this.channels().forEach((c) => this.remove(c));
      this._events.clear();
    }
  }

  count(channel) {
    const event = this._events.get(channel);
    return event ? event.size : 0;
  }

  listeners(channel) {
    const event = this._events.get(channel);
    return new Set(event);
  }

  channels() {
    return [...this._events.keys()];
  }

  async releaseConnection() {
    try {
      await knex.client.releaseConnection(this._connection);
      delete this._connection;
    } catch (e) {
      logger.error(e);
    }
  }

  async _setupConnection() {
    this._connection = await knex.client.acquireConnection();
    this._connection.on('notification', (data) => {
      const { channel } = data;
      const event = this._events.get(channel);
      if (!event) return;
      for (const callback of event.values()) {
        const { payload } = data;
        logger.database({
          ms: 0,
          request: `[notification] ${channel} ${payload}`,
        });
        callback({
          ...data,
          payload: JSON.parse(payload),
        });
      }
    });
  }
}

module.exports = {
  PgEvent,
};
