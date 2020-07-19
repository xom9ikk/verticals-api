const { CollectionIterator } = require('../utils');

class FormatterMiddleware {
  static castToInteger(type) {
    return (req, res, next) => {
      try {
        const transformer = (data) => {
          const parsedNumber = parseInt(data);
          if (parsedNumber.toString() === data) {
            return parsedNumber;
          }
          return data;
        };
        req[type] = CollectionIterator.deepIterateValues(req[type], transformer);
        next();
      } catch (e) {
        next(e);
      }
    };
  }
}

module.exports = {
  FormatterMiddleware,
};
