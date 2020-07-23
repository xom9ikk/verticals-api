const faker = require('faker');
const { Color, TodoStatus } = require('../../src/enums');

class TodoDataGenerator {
  static get(columnId) {
    return {
      columnId,
      title: 'test column title',
      position: 0,
      description: 'test column description',
      status: TodoStatus.todo,
      color: Color.red,
      isArchived: true,
      isNotificationsEnabled: true,
    };
  }

  static getUnique(columnId) {
    return {
      columnId,
      title: faker.lorem.words(),
      position: faker.random.number({ min: 0 }),
      description: faker.lorem.sentences(),
      status: faker.random.number({ max: 2 }),
      color: faker.random.number({ max: 5 }),
      isArchived: faker.random.boolean(),
      isNotificationsEnabled: faker.random.boolean(),
    };
  }
  //
  // static getLongTitle() {
  //   return ''.padStart(256, 'longtitle');
  // }
  //
  // static getNegativePosition() {
  //   return faker.random.number({ max: -100 });
  // }
  //
  // static getStringPosition() {
  //   return faker.random.number({ min: 0 }).toString();
  // }
  //
  // static getNegativeColor() {
  //   return faker.random.number({ max: -100 });
  // }
  //
  // static getStringColor() {
  //   return faker.random.number({ min: 0 }).toString();
  // }
  //
  // static getInvalidColor() {
  //   return faker.random.number({ min: 6, max: 10 }).toString();
  // }
  //
  // static getNegativeBoardId() {
  //   return faker.random.number({ max: -100 });
  // }
}

module.exports = {
  TodoDataGenerator,
};
