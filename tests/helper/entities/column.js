const faker = require('faker');

class Column {
  constructor(id, boardId, todos) {
    this.id = id;
    this.boardId = boardId;
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
  Column,
};
