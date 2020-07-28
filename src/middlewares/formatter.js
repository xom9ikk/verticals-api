const { CollectionIterator } = require('../utils');

class FormatterMiddleware {
  static castToInteger(type) {
    return async (req) => {
      const transformer = (data) => {
        const parsedNumber = parseInt(data);
        if (parsedNumber.toString() === data) {
          return parsedNumber;
        }
        return data;
      };

      req[type] = CollectionIterator.deepIterateValues(req[type], transformer);
    };
  }
}

module.exports = {
  FormatterMiddleware,
};
