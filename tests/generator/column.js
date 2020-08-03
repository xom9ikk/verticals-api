const faker = require('faker');

class ColumnDataGenerator {
  static getUnique(boardId) {
    return {
      boardId,
      title: faker.lorem.words(),
      position: faker.random.number({ min: 0 }),
      description: faker.lorem.sentences(),
      color: faker.random.number({ max: 5 }),
      isCollapsed: faker.random.boolean(),
    };
  }

  static getLongTitle() {
    return ''.padStart(256, 'longtitle');
  }

  static getNegativePosition() {
    return faker.random.number({ max: -100 });
  }

  static getStringPosition() {
    return faker.random.number({ min: 0 }).toString();
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

  static getNegativeBoardId() {
    return faker.random.number({ max: -100 });
  }
}

module.exports = {
  ColumnDataGenerator,
};
