const faker = require('faker');
const { Color } = require('../../src/enums');

class ColumnDataGenerator {
  static get(boardId) {
    return {
      boardId,
      title: 'test column title',
      position: 0,
      description: 'test column description',
      color: Color.red,
      isCollapsed: true,
    };
  }

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
