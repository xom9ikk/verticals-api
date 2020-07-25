/* eslint-disable no-underscore-dangle */
const chalk = require('chalk');

const COLORIZE = {
  primary: chalk.cyan,
  error: chalk.red,
  success: chalk.gray,
};

class KnexLogger {
  constructor(knexInstance, options = {}) {
    this.queries = new Map();

    const { logger = console.log, bindings: withBindings = true } = options;
    this.print = this.makeQueryPrinter(knexInstance, { logger, withBindings });

    return knexInstance
      .on('query', this.handleQuery.bind(this))
      .on('query-error', this.handleQueryError.bind(this))
      .on('query-response', this.handleQueryResponse.bind(this));
  }

  measureDuration(startTime) {
    const diff = process.hrtime(startTime);
    const duration = diff[0] * 1e3 + diff[1] * 1e-6;
    return duration;
  }

  withQuery(queryId, fn) {
    const query = this.queries.get(queryId);
    this.queries.delete(queryId);
    if (!query) throw new TypeError('Query disappeared');
    const { sql, bindings, startTime } = query;
    const duration = this.measureDuration(startTime);
    fn({ sql, bindings, duration });
  }

  handleQuery({ __knexQueryUid: queryId, sql, bindings }) {
    const startTime = process.hrtime();
    this.queries.set(queryId, { sql, bindings, startTime });
  }

  handleQueryError(_error, { __knexQueryUid: queryId }) {
    this.withQuery(queryId, ({ sql, bindings, duration }) => {
      this.print({ sql, bindings, duration }, COLORIZE.error);
    });
  }

  handleQueryResponse(_response, { __knexQueryUid: queryId }) {
    this.withQuery(queryId, ({ sql, bindings, duration }) => {
      this.print({ sql, bindings, duration }, COLORIZE.success);
    });
  }

  makeQueryPrinter(_knex, { logger, withBindings }) {
    return ({ sql, bindings, duration }, colorize) => {
      const sqlRequest = _knex.client._formatQuery(sql, withBindings ? bindings : null);
      logger(
        `${COLORIZE.primary(`SQL (${duration.toFixed(3)} ms)`)} ${colorize(sqlRequest)}`,
      );
    };
  }
}

module.exports = {
  KnexLogger,
};
