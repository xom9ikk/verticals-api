/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const FormData = require('form-data');

class Request {
  constructor(app) {
    this.app = app;
    this.headers = {};
    this.queries = {};
  }

  set(name, value) {
    this.headers[name] = value;
    return this;
  }

  query(obj) {
    this.queries = obj;
    return this;
  }

  get(route) {
    this.route = route;
    this.method = 'GET';
    return this;
  }

  post(route) {
    this.route = route;
    this.method = 'POST';
    return this;
  }

  patch(route) {
    this.route = route;
    this.method = 'PATCH';
    return this;
  }

  delete(route) {
    this.route = route;
    this.method = 'DELETE';
    return this;
  }

  async send(payload) {
    const response = await this.app.inject({
      method: this.method,
      url: this.route,
      headers: this.headers,
      query: this.queries,
      payload,
    });
    response.body = JSON.parse(response.body);
    return response;
  }

  attach(name, path) {
    const form = new FormData();
    form.append(name, fs.createReadStream(path));
    this.headers = {
      ...this.headers,
      ...form.getHeaders(),
    };
    return this.send(form);
  }
}

module.exports = {
  Request,
};
