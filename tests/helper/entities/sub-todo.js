const faker = require('faker');

class SubTodo {
  constructor(id, todoId, comments) {
    this.id = id;
    this.todoId = todoId;
    this.comments = comments;
  }

  getRandomComment() {
    const randomIndex = faker.random.number({ max: this.comments.length - 1 });
    return this.comments[randomIndex];
  }
}

module.exports = {
  SubTodo,
};
