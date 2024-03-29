/* eslint-disable no-underscore-dangle */
const now = require('performance-now');

class KnexLogger {
  constructor(knexInstance, options = {}) {
    this.queries = new Map();

    const { bindings: withBindings = true } = options;
    this.print = this.makeQueryPrinter(knexInstance, { withBindings });

    return knexInstance
      .on('query', this.handleQuery.bind(this))
      .on('query-error', this.handleQueryError.bind(this))
      .on('query-response', this.handleQueryResponse.bind(this));
  }

  withQuery(queryId, fn) {
    const query = this.queries.get(queryId);
    this.queries.delete(queryId);
    if (!query) throw new TypeError('Query disappeared');
    const { sql, bindings, startTime } = query;
    const duration = now() - startTime;
    fn({ sql, bindings, duration });
  }

  handleQuery({ __knexQueryUid: queryId, sql, bindings }) {
    const startTime = now();
    this.queries.set(queryId, { sql, bindings, startTime });
  }

  handleQueryError(_error, { __knexQueryUid: queryId }) {
    this.withQuery(queryId, ({ sql, bindings, duration }) => {
      this.print({ sql, bindings, duration }, true);
    });
  }

  handleQueryResponse(_response, { __knexQueryUid: queryId }) {
    this.withQuery(queryId, ({ sql, bindings, duration }) => {
      this.print({ sql, bindings, duration }, false);
    });
  }

  makeQueryPrinter(_knex, { withBindings }) {
    return ({ sql, bindings, duration }, isError) => {
      const sqlRequest = _knex.client._formatQuery(sql, withBindings ? bindings : null);
      logger.database({
        ms: duration.toFixed(3),
        request: sqlRequest,
        isError,
      });
    };
  }
}

module.exports = {
  KnexLogger,
};
