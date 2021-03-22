const faker = require('faker');

class Todo {
  constructor(id, headingId, subtodos, comments) {
    this.id = id;
    this.headingId = headingId;
    this.subtodos = subtodos;
    this.comments = comments;
  }

  getRandomSubTodo() {
    const randomIndex = faker.random.number({ max: this.subtodos.length - 1 });
    return this.subtodos[randomIndex];
  }

  getRandomComment() {
    const randomIndex = faker.random.number({ max: this.comments.length - 1 });
    return this.comments[randomIndex];
  }
}

module.exports = {
  Todo,
};
