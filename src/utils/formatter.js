const camelCase = require('lodash.camelcase');
const snakeCase = require('lodash.snakecase');
const { CollectionIterator } = require('./collection-iterator');

class Formatter {
  static deepConvertToCamelCase(data) {
    return CollectionIterator.deepIterate(data, camelCase);
  }

  static deepConvertToSnakeCase(data) {
    return CollectionIterator.deepIterate(data, snakeCase);
  }

  static convertToSnakeCase(data) {
    return snakeCase(data);
  }
}

module.exports = {
  Formatter,
};
