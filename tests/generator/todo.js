const faker = require('faker');

class TodoDataGenerator {
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
      expirationDate: faker.date.past(),
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

  static getNegativeColumnId() {
    return faker.random.number({ max: -100 });
  }
}

module.exports = {
  TodoDataGenerator,
};
