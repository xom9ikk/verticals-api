const faker = require('faker');

class TodoDataGenerator {
  static getUnique(headingId) {
    return {
      headingId,
      title: faker.lorem.words(),
      description: faker.lorem.sentences(),
      status: faker.random.number({ max: 2 }),
      color: faker.random.number({ max: 5 }),
      isNotificationsEnabled: faker.random.boolean(),
      expirationDate: faker.date.past(),
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

  static getNegativeHeadingId() {
    return faker.random.number({ max: -100 });
  }
}

module.exports = {
  TodoDataGenerator,
};
