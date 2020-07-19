const camelCase = require('lodash.camelcase');
const snakeCase = require('lodash.snakecase');
const { CollectionIterator } = require('./collection-iterator');

class Formatter {
  static deepConvertToCamelCase(data) {
    return CollectionIterator.deepIterateKeys(data, camelCase);
  }

  static deepConvertToSnakeCase(data) {
    return CollectionIterator.deepIterateKeys(data, snakeCase);
  }

  static convertToSnakeCase(data) {
    return snakeCase(data);
  }
}

module.exports = {
  Formatter,
};
