/* eslint-disable no-underscore-dangle */
const isArray = require('lodash.isarray');
const isObject = require('lodash.isobject');
const map = require('lodash.map');
const mapKeys = require('lodash.mapkeys');
const mapValues = require('lodash.mapvalues');

const iterationType = {
  keys: 0,
  values: 1,
};

class CollectionIterator {
  static deepIterateKeys(data, transformer) {
    return this._deepIterate(data, transformer, iterationType.keys);
  }

  static deepIterateValues(data, transformer) {
    return this._deepIterate(data, transformer, iterationType.values);
  }

  static _deepIterate(data, transformer, type) {
    if (isArray(data)) {
      return map(data, (element) => CollectionIterator._deepIterate(element, transformer, type));
    }
    if (data instanceof Date) {
      return data.getTime();
    }
    if (isObject(data)) {
      let iterateData = data;
      if (type === iterationType.keys) {
        iterateData = mapKeys(data, (v, k) => transformer(k));
      }
      return mapValues(iterateData, (v) => CollectionIterator._deepIterate(v, transformer, type));
    }
    if (type === iterationType.values) {
      return transformer(data);
    }
    return data;
  }
}

module.exports = {
  CollectionIterator,
};
