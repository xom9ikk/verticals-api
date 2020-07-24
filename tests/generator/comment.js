const faker = require('faker');

class CommentDataGenerator {
  static getUnique(todoId, replyCommentId) {
    return {
      todoId,
      text: faker.lorem.sentences(),
      isEdited: faker.random.boolean(),
      replyCommentId,
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
  CommentDataGenerator,
};
