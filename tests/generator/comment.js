const faker = require('faker');

class CommentDataGenerator {
  static getUnique(todoId, replyCommentId) {
    return {
      todoId,
      text: faker.lorem.sentences(),
      replyCommentId,
    };
  }

  static getLongText() {
    return ''.padStart(4097, 'longtext');
  }

  static getNegativeTodoId() {
    return faker.random.number({ max: -100 });
  }
}

module.exports = {
  CommentDataGenerator,
};
