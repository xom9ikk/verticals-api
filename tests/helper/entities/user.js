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
    return this.getRandomColumn().id;
  }

  // -
  getRandomColumnFromBoard(boardId) {
    return this.getBoardById(boardId).getRandomColumn();
  }

  getRandomColumnIdFromBoard(boardId) {
    return this.getRandomColumnFromBoard(boardId).id;
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

  getRandomHeading() {
    return this.getRandomBoard().getRandomColumn().getRandomHeading();
  }

  getRandomHeadingId() {
    return this.getRandomHeading().id;
  }

  // -
  getRandomHeadingIdFromBoard(boardId) {
    return this.getBoardById(boardId).getRandomColumn().getRandomHeading().id;
  }

  getHeadingIds() {
    const headingIds = [];
    this.boards.forEach((board) => {
      board.columns.forEach((column) => {
        column.headings.forEach((todo) => {
          headingIds.push(todo.id);
        });
      });
    });
    return headingIds;
  }

  getRandomTodo() {
    return this.getRandomBoard().getRandomColumn().getRandomHeading().getRandomTodo();
  }

  getRandomTodoId() {
    return this.getRandomTodo().id;
  }

  // -
  getRandomTodoIdFromBoard(boardId) {
    return this.getBoardById(boardId).getRandomColumn().getRandomHeading().getRandomTodo().id;
  }

  getTodoIds() {
    const todoIds = [];
    this.boards.forEach((board) => {
      board.columns.forEach((column) => {
        column.headings.forEach((heading) => {
          heading.todos.forEach((todo) => {
            todoIds.push(todo.id);
          });
        });
      });
    });
    return todoIds;
  }

  getRandomComment() {
    return this.getRandomBoard().getRandomColumn().getRandomHeading().getRandomTodo()
      .getRandomComment();
  }

  getRandomCommentId() {
    return this.getRandomComment().id;
  }

  getCommentIds() {
    const commentIds = [];
    this.boards.forEach((board) => {
      board.columns.forEach((column) => {
        column.heading.forEach((heading) => {
          heading.todos.forEach((todo) => {
            todo.comments.forEach((comment) => {
              commentIds.push(comment.id);
            });
          });
        });
      });
    });
    return commentIds;
  }
}

module.exports = {
  User,
};
