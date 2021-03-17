const faker = require('faker');

class Heading {
  constructor(id, columnId, todos) {
    this.id = id;
    this.columnId = columnId;
    this.todos = todos;
  }

  getRandomTodo() {
    const randomIndex = faker.random.number({ max: this.todos.length - 1 });
    return this.todos[randomIndex];
  }

  getRandomTodoId() {
    return this.getRandomTodo().id;
  }
}

module.exports = {
  Heading,
};
