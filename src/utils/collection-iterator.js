const isArray = require('lodash.isarray');
const isObject = require('lodash.isobject');
const map = require('lodash.map');
const mapKeys = require('lodash.mapkeys');
const mapValues = require('lodash.mapvalues');

class CollectionIterator {
  static deepIterate(data, transformer) {
    if (isArray(data)) {
      return map(data, (element) => CollectionIterator.deepIterate(element, transformer));
    }
    if (isObject(data)) {
      const a = mapKeys(data, (v, k) => transformer(k));
      return mapValues(a, (v) => CollectionIterator.deepIterate(v, transformer));
    }
    return data;
  }
}

module.exports = {
  CollectionIterator,
};
