const faker = require('faker');

class Todo {
  constructor(id, headingId, subtodos, comments) {
    this.id = id;
    this.headingId = headingId;
    this.subTodos = subtodos;
    this.comments = comments;
  }

  getRandomSubTodo() {
    const randomIndex = faker.random.number({ max: this.subTodos.length - 1 });
    return this.subTodos[randomIndex];
  }

  getRandomComment() {
    const randomIndex = faker.random.number({ max: this.comments.length - 1 });
    return this.comments[randomIndex];
  }
}

module.exports = {
  Todo,
};
