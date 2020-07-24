const faker = require('faker');

class BoardDataGenerator {
  static getUnique() {
    return {
      title: faker.lorem.words(),
      position: faker.random.number({ min: 0 }),
      cardType: faker.random.number({ max: 4 }),
      description: faker.lorem.sentences(),
      color: faker.random.number({ max: 5 }),
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

  static getNegativeCardType() {
    return faker.random.number({ max: -100 });
  }

  static getStringCardType() {
    return faker.random.number({ min: 0 }).toString();
  }

  static getInvalidCardType() {
    return faker.random.number({ min: 5, max: 10 }).toString();
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
}

module.exports = {
  BoardDataGenerator,
};
