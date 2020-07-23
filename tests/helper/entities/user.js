const faker = require('faker');

class User {
  constructor(token, refreshToken, boards) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.boards = boards;
  }

  getToken() {
    return this.token;
  }

  getRefreshToken() {
    return this.token;
  }

  getBoards() {
    return this.boards;
  }

  getRandomBoard() {
    const randomIndex = faker.random.number({ max: this.boards.length - 1 });
    return this.boards[randomIndex];
  }

  getRandomBoardId() {
    return this.getRandomBoard().id;
  }

  getRandomColumn() {
    return this.getRandomBoard().getRandomColumn();
  }

  getRandomTodo() {
    return this.getRandomBoard().getRandomColumn().getRandomTodo();
  }

  getRandomComment() {
    return this.getRandomBoard().getRandomColumn().getRandomTodo().getRandomComment();
  }
}

module.exports = {
  User,
};
