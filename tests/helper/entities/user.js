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

  getBoardById(boardId) {
    return this.boards.find((board) => board.id === boardId);
  }

  getRandomBoard() {
    const randomIndex = faker.random.number({ max: this.boards.length - 1 });
    return this.boards[randomIndex];
  }

  getRandomBoardId() {
    return this.getRandomBoard().id;
  }

  getBoardIds() {
    return this.boards.map((board) => board.id);
  }

  getRandomColumn() {
    return this.getRandomBoard().getRandomColumn();
  }

  getRandomColumnId() {
    return this.getRandomBoard().getRandomColumnId();
  }

  // -
  getRandomColumnIdFromBoard(boardId) {
    return this.getBoardById(boardId).getRandomColumn().id;
  }

  getColumnIds() {
    const columnIds = [];
    this.boards.forEach((board) => {
      board.columns.forEach((column) => {
        columnIds.push(column.id);
      });
    });
    return columnIds;
  }

  getRandomTodo() {
    return this.getRandomBoard().getRandomColumn().getRandomTodo();
  }

  getRandomTodoId() {
    return this.getRandomBoard().getRandomColumn().getRandomTodo().id;
  }

  // -
  getRandomTodoIdFromBoard(boardId) {
    return this.getBoardById(boardId).getRandomColumn().getRandomTodo().id;
  }

  getTodoIds() {
    const todoIds = [];
    this.boards.forEach((board) => {
      board.columns.forEach((column) => {
        column.todos.forEach((todo) => {
          todoIds.push(todo.id);
        });
      });
    });
    return todoIds;
  }

  getRandomComment() {
    return this.getRandomBoard().getRandomColumn().getRandomTodo().getRandomComment();
  }
}

module.exports = {
  User,
};
