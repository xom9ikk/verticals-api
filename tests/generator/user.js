const faker = require('faker');

class UserDataGenerator {
  static get() {
    return {
      email: 'test@test.test',
      password: '123456',
      name: 'testname',
      surname: 'testsurname',
      username: 'test',
    };
  }

  static getUnique() {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.firstName().replace('\'', ''),
      surname: faker.name.lastName().replace('\'', ''),
      username: faker.internet.userName(),
    };
  }

  static getInvalidEmail() {
    return 'invalid.at.invalid';
  }

  static getLongEmail() {
    return '@gmail.com'.padStart(65, 'longemail');
  }

  static getLongUsername() {
    return ''.padStart(33, 'longusername');
  }

  static getShortUsername() {
    return 's';
  }

  static getLongName() {
    return ''.padStart(33, 'longname');
  }

  static getShortName() {
    return 's';
  }

  static getInvalidPassword() {
    return faker.internet.password();
  }
}

module.exports = {
  UserDataGenerator,
};
