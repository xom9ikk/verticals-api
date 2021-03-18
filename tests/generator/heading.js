const faker = require('faker');

class HeadingDataGenerator {
  static getUnique(columnId) {
    return {
      columnId,
      title: faker.lorem.words(),
      description: faker.lorem.sentences(),
      color: faker.random.number({ max: 5 }),
      isCollapsed: faker.random.boolean(),
    };
  }

  static getLongTitle() {
    return ''.padStart(256, 'longtitle');
  }

  static getNegativeColor() {
    return faker.random.number({ max: -100 });
  }

  static getStringColor() {
    return faker.random.number({ min: 0 }).toString();
  }

  static getInvalidColor() {
    return faker.random.number({ min: 6, max: 10 }).toString();
  }

  static getNegativeColumnId() {
    return faker.random.number({ max: -100 });
  }
}

module.exports = {
  HeadingDataGenerator,
};
