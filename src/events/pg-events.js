/* eslint-disable no-underscore-dangle,no-async-promise-executor,no-restricted-syntax */
class PgEvent {
  constructor() {
    return new Promise(async (resolve) => {
      if (typeof PgEvent.instance === 'object') {
        return resolve(PgEvent.instance);
      }
      this._connection = await knex.client.acquireConnection();
      this._events = new Map();
      this._wrappers = new Map();
      this._connection.on('notification', (data) => {
        const { channel } = data;
        const event = this._events.get(channel);
        if (!event) return;
        logger.info(`PG notification ${channel}`);
        for (const callback of event.values()) {
          const { payload } = data;
          callback({
            ...data,
            payload: JSON.parse(payload),
          });
        }
      });
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
    const wrapper = (...args) => {
      this.remove(channel, wrapper);
      callback(...args);
    };
    this._wrappers.set(callback, wrapper);
    this.on(channel, wrapper);
  }

  remove(channel, callback) {
    this._connection.query(`UNLISTEN ${channel}`);

    const event = this._events.get(channel);
    if (!event) return;
    if (event.has(callback)) {
      event.delete(callback);
      return;
    }

    const wrapper = this._wrappers.get(callback);
    if (wrapper) {
      event.delete(wrapper);
      if (event.size === 0) this._events.delete(channel);
    }
  }

  clear(channel) {
    if (channel) this._events.delete(channel);
    else this._events.clear();
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
}

module.exports = {
  PgEvent,
};
