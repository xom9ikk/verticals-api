const { CollectionIterator } = require('../utils');

class FormatterMiddleware {
  static castToInteger(type) {
    return (req, res, done) => {
      const transformer = (data) => {
        const parsedNumber = parseInt(data);
        if (parsedNumber.toString() === data) {
          return parsedNumber;
        }
        return data;
      };

      req[type] = CollectionIterator.deepIterateValues(req[type], transformer);
      done();
    };
  }
}

module.exports = {
  FormatterMiddleware,
};
