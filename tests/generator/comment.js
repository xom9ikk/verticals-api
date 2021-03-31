const faker = require('faker');

class CommentDataGenerator {
  static getUnique({ todoId, subTodoId } = {}, replyCommentId) {
    return {
      todoId,
      subTodoId,
      text: faker.lorem.sentences(),
      replyCommentId,
    };
  }

  static getLongText() {
    return ''.padStart(16385, 'longtext');
  }

  static getNegativeTodoId() {
    return faker.random.number({ max: -100 });
  }
}

module.exports = {
  CommentDataGenerator,
};
